import { useEffect, useRef } from 'react';
import { useLang } from '@/lib/lang';

/**
 * Simulação de uma camada convolucional. Um kernel 3×3 (detector de bordas)
 * varre a grade de entrada passo a passo; cada passo calcula a soma ponderada
 * da janela e escreve o resultado no mapa de características à direita.
 *
 * Modo fundo: entrada fixa (uma barra diagonal), sem interação.
 * Modo desenho (`interactive`): arrastar o mouse pinta a entrada, a convolução
 * roda sobre o desenho em tempo real e passar o mouse numa célula de saída
 * mostra a conta daquela janela.
 */

const KERNEL = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
const STEP_SEC = 0.12;
const HOLD_SEC = 2;
const BG_DIMS = { c: 14, r: 9 };
const DRAW_DIMS = { c: 22, r: 14 };

interface Actions { clear?: () => void }

export default function ConvCanvas({
  className = '',
  interactive = false,
  onClose,
}: {
  className?: string;
  interactive?: boolean;
  onClose?: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const actions = useRef<Actions>({});
  const { lang } = useLang();
  const pt = lang === 'pt';

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const { c: IN_C, r: IN_R } = interactive ? DRAW_DIMS : BG_DIMS;
    const OUT_C = IN_C - 2, OUT_R = IN_R - 2, TOTAL = OUT_C * OUT_R;

    // entrada: no modo fundo é uma barra diagonal com ruído fixo; no modo desenho começa vazia
    const cells = new Array<number>(IN_C * IN_R).fill(0);
    if (!interactive) {
      for (let r = 0; r < IN_R; r++)
        for (let c = 0; c < IN_C; c++) {
          const bar = Math.abs(c - 3 - r * 0.7) < 1.1 ? 0.85 : 0;
          const blob = c > 9 && r < 4 ? 0.5 : 0;
          cells[r * IN_C + c] = Math.min(1, bar + blob + Math.random() * 0.12);
        }
    }

    let W = 0, H = 0, dpr = 1, s = 10;
    let gx0 = 0, gy0 = 0, outX0 = 0;
    let step = 0;      // passos do kernel já executados neste ciclo
    let acc = 0;       // tempo acumulado até o próximo passo
    let hold = 0;      // pausa ao fim do ciclo
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let painting = false;
    let lastP: { x: number; y: number } | null = null;
    let hoverK = -1;   // célula de saída sob o cursor (modo desenho)

    const build = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const wide = W > 900;
      const x0 = interactive ? W * 0.06 : wide ? W * 0.48 : W * 0.08;
      const x1 = interactive ? W * 0.94 : wide ? W * 0.96 : W * 0.92;
      // entrada + espaço + saída = (IN_C + 4 + OUT_C) células de largura
      const cellCols = IN_C + 4 + OUT_C;
      s = Math.max(4, Math.min((x1 - x0) / cellCols, (H * 0.6) / IN_R));
      gy0 = (H - IN_R * s) / 2;
      gx0 = interactive ? (W - cellCols * s) / 2 : x0;
      outX0 = gx0 + (IN_C + 4) * s;
      step = 0; acc = 0; hold = 0;
    };

    const outValue = (oc: number, or: number) => {
      let sum = 0;
      for (let kr = 0; kr < 3; kr++)
        for (let kc = 0; kc < 3; kc++)
          sum += KERNEL[kr * 3 + kc] * cells[(or + kr) * IN_C + (oc + kc)];
      return sum;
    };

    const heat = (v: number, a: number) =>
      v >= 0
        ? `rgba(255,138,92,${a})`   // brasa: ativação positiva
        : `rgba(169,149,255,${a})`; // lilás: ativação negativa

    // ---------- pintura (modo desenho) ----------
    const cellAt = (x: number, y: number) => {
      const c = Math.floor((x - gx0) / s), r = Math.floor((y - gy0) / s);
      return c >= 0 && c < IN_C && r >= 0 && r < IN_R ? { r, c } : null;
    };
    const paintAt = (x: number, y: number) => {
      const rc = cellAt(x, y);
      if (!rc) return;
      cells[rc.r * IN_C + rc.c] = 1;
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const rr = rc.r + dr, cc = rc.c + dc;
        if (rr >= 0 && rr < IN_R && cc >= 0 && cc < IN_C)
          cells[rr * IN_C + cc] = Math.max(cells[rr * IN_C + cc], 0.6);
      }
    };
    // interpola entre amostras do ponteiro para não deixar falhas em arrasto rápido
    const paintLine = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      const n = Math.max(1, Math.ceil(d / (s * 0.5)));
      for (let i = 0; i <= n; i++)
        paintAt(a.x + ((b.x - a.x) * i) / n, a.y + ((b.y - a.y) * i) / n);
    };
    const hoverIndex = (x: number, y: number) => {
      const oc = Math.floor((x - outX0) / s), or = Math.floor((y - gy0) / s);
      return oc >= 0 && oc < OUT_C && or >= 0 && or < OUT_R ? or * OUT_C + oc : -1;
    };
    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    // redesenha um quadro estático quando não há loop de animação
    const kick = () => { if (reduced) draw(performance.now(), false); };

    const drawTooltip = (k: number) => {
      const oc = k % OUT_C, or = Math.floor(k / OUT_C);
      const kx = gx0 + oc * s, ky = gy0 + or * s;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(kx + 0.75, ky + 0.75, 3 * s - 1.5, 3 * s - 1.5);

      // produto elemento a elemento da janela e soma
      const rows: string[] = [];
      let sum = 0;
      for (let kr = 0; kr < 3; kr++) {
        const parts: string[] = [];
        for (let kc = 0; kc < 3; kc++) {
          const p = KERNEL[kr * 3 + kc] * cells[(or + kr) * IN_C + (oc + kc)];
          sum += p;
          parts.push(p.toFixed(1).padStart(5));
        }
        rows.push(parts.join(' '));
      }
      const pw = 170, ph = 92;
      const px = Math.min(outX0 + oc * s + s + 12, W - pw - 6);
      const py = Math.max(6, Math.min(ky - 20, H - ph - 6));
      ctx.fillStyle = 'rgba(12,12,22,0.92)';
      ctx.strokeStyle = 'rgba(255,138,92,0.5)';
      ctx.lineWidth = 1;
      ctx.fillRect(px, py, pw, ph);
      ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = 'rgba(220,220,240,0.9)';
      ctx.textBaseline = 'top';
      rows.forEach((row, i) => ctx.fillText(row, px + 10, py + 10 + i * 16));
      ctx.fillStyle = 'rgba(255,138,92,1)';
      ctx.fillText(`${pt ? 'soma' : 'sum'} = ${sum.toFixed(2)}`, px + 10, py + 10 + 3 * 16 + 4);
    };

    const draw = (now: number, advance: boolean) => {
      const dt = advance ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      ctx.clearRect(0, 0, W, H);

      // avança a varredura
      if (advance) {
        if (step < TOTAL) {
          acc += dt;
          while (acc >= STEP_SEC && step < TOTAL) { acc -= STEP_SEC; step++; }
        } else {
          hold += dt;
          if (hold >= HOLD_SEC) { step = 0; acc = 0; hold = 0; }
        }
      }

      // grade de entrada
      for (let r = 0; r < IN_R; r++) {
        for (let c = 0; c < IN_C; c++) {
          const v = cells[r * IN_C + c];
          ctx.fillStyle = `rgba(150,160,200,${0.08 + v * 0.45})`;
          ctx.fillRect(gx0 + c * s + 1, gy0 + r * s + 1, s - 2, s - 2);
        }
      }

      // mapa de características (células já varridas)
      const done = Math.min(step, TOTAL);
      for (let k = 0; k < TOTAL; k++) {
        const oc = k % OUT_C, or = Math.floor(k / OUT_C);
        const x = outX0 + oc * s, y = gy0 + or * s;
        if (k < done) {
          const v = outValue(oc, or);
          const a = Math.min(0.92, 0.12 + (Math.abs(v) / 4) * 0.8);
          ctx.fillStyle = heat(v, a);
          ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
        } else {
          ctx.strokeStyle = 'rgba(150,150,180,0.12)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 1.5, y + 1.5, s - 3, s - 3);
        }
      }

      // janela do kernel e conexão com a célula sendo escrita
      if (step > 0 && step <= TOTAL) {
        const k = Math.min(step, TOTAL) - 1;
        const oc = k % OUT_C, or = Math.floor(k / OUT_C);
        const kx = gx0 + oc * s, ky = gy0 + or * s;
        ctx.fillStyle = 'rgba(255,138,92,0.10)';
        ctx.fillRect(kx, ky, 3 * s, 3 * s);
        ctx.strokeStyle = 'rgba(255,138,92,0.9)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(kx + 0.75, ky + 0.75, 3 * s - 1.5, 3 * s - 1.5);

        const ox = outX0 + oc * s + s / 2, oy = gy0 + or * s + s / 2;
        ctx.strokeStyle = 'rgba(255,138,92,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(kx + 1.5 * s, ky + 1.5 * s);
        ctx.lineTo(ox, oy);
        ctx.stroke();
      }

      // detalhe da célula sob o cursor (só células já calculadas)
      if (interactive && hoverK >= 0 && hoverK < done) drawTooltip(hoverK);

      if (advance && visible) raf = requestAnimationFrame((t) => draw(t, true));
    };

    build();
    const ro = new ResizeObserver(() => { build(); kick(); });
    ro.observe(canvas);

    actions.current.clear = () => {
      cells.fill(0);
      step = 0; acc = 0; hold = 0;
      kick();
    };

    const onDown = (e: PointerEvent) => {
      painting = true;
      canvas.setPointerCapture(e.pointerId);
      const p = pos(e);
      paintAt(p.x, p.y);
      lastP = p;
      kick();
    };
    const onMove = (e: PointerEvent) => {
      const p = pos(e);
      if (painting && lastP) {
        paintLine(lastP, p);
        lastP = p;
      } else {
        hoverK = hoverIndex(p.x, p.y);
      }
      kick();
    };
    const onUp = () => { painting = false; lastP = null; };
    const onLeave = () => { if (!painting) { hoverK = -1; kick(); } };

    if (interactive) {
      canvas.style.touchAction = 'none';
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerup', onUp);
      canvas.addEventListener('pointercancel', onUp);
      canvas.addEventListener('pointerleave', onLeave);
    }

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame((t) => draw(t, true));
      }
    });
    io.observe(canvas);

    if (reduced) {
      // um quadro estático com a varredura pela metade
      step = Math.floor(TOTAL * 0.45);
      visible = false;
      draw(performance.now(), false);
    } else {
      raf = requestAnimationFrame((t) => draw(t, true));
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.style.touchAction = '';
      actions.current = {};
    };
  }, [interactive, pt]);

  return (
    <>
      <canvas ref={ref} className={className} aria-hidden={!interactive} />
      {interactive && (
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            onClick={() => actions.current.clear?.()}
            className="rounded-full border border-ink-600 bg-ink-900/80 px-3 py-1.5 text-xs text-ink-100 hover:border-ember-400/60"
          >
            {pt ? 'Limpar' : 'Clear'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-ink-600 bg-ink-900/80 px-3 py-1.5 text-xs text-ink-100 hover:border-ember-400/60"
          >
            {pt ? 'Fechar' : 'Close'}
          </button>
        </div>
      )}
    </>
  );
}
