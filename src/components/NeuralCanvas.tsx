import { useEffect, useRef } from 'react';

/**
 * Rede neural viva: pulsos percorrem as conexões como um forward pass,
 * neurônios "disparam" e propagam para a próxima camada. O cursor excita
 * os neurônios próximos.
 */

interface Node { layer: number; bx: number; by: number; x: number; y: number; phase: number; fire: number }
interface Pulse { from: number; to: number; t: number; speed: number; hue: number }

const LAYERS = [4, 7, 9, 9, 6, 3];

export default function NeuralCanvas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, dpr = 1;
    let nodes: Node[] = [];
    let byLayer: number[][] = [];
    let pulses: Pulse[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let visible = true;
    let lastWave = 0;
    let last = performance.now();

    const build = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const wide = W > 900;
      const x0 = wide ? W * 0.48 : W * 0.08;
      const x1 = wide ? W * 0.96 : W * 0.92;
      const yPad = H * 0.14;
      nodes = []; byLayer = [];
      LAYERS.forEach((n, li) => {
        const ids: number[] = [];
        const x = x0 + ((x1 - x0) * li) / (LAYERS.length - 1);
        for (let i = 0; i < n; i++) {
          const y = yPad + ((H - 2 * yPad) * (i + 0.5)) / n;
          ids.push(nodes.length);
          nodes.push({ layer: li, bx: x, by: y, x, y, phase: Math.random() * Math.PI * 2, fire: 0 });
        }
        byLayer.push(ids);
      });
      pulses = [];
    };

    const spawnFrom = (id: number, count: number) => {
      const n = nodes[id];
      const next = byLayer[n.layer + 1];
      if (!next) return;
      for (let k = 0; k < count; k++) {
        pulses.push({
          from: id,
          to: next[Math.floor(Math.random() * next.length)],
          t: 0,
          speed: 0.6 + Math.random() * 0.7,
          hue: Math.random(),
        });
      }
    };

    const wave = () => {
      const inputs = byLayer[0];
      const k = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < k; i++) {
        const id = inputs[Math.floor(Math.random() * inputs.length)];
        nodes[id].fire = 1;
        spawnFrom(id, 2);
      }
    };

    const color = (h: number, a: number) =>
      // mistura brasa (255,107,61) → âmbar (255,193,94) → lilás (169,149,255)
      h < 0.6
        ? `rgba(255,${Math.round(107 + (193 - 107) * (h / 0.6))},${Math.round(61 + (94 - 61) * (h / 0.6))},${a})`
        : `rgba(${Math.round(255 - (255 - 169) * ((h - 0.6) / 0.4))},${Math.round(193 - (193 - 149) * ((h - 0.6) / 0.4))},${Math.round(94 + (255 - 94) * ((h - 0.6) / 0.4))},${a})`;

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, W, H);

      // deriva suave dos neurônios
      for (const n of nodes) {
        n.x = n.bx + Math.sin(now / 2400 + n.phase) * 5;
        n.y = n.by + Math.cos(now / 2000 + n.phase * 1.3) * 7;
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (d < 120) {
          n.fire = Math.max(n.fire, 1 - d / 120);
          if (Math.random() < 0.02) spawnFrom(nodes.indexOf(n), 1);
        }
        n.fire *= 0.94;
      }

      // conexões
      ctx.lineWidth = 1;
      for (let li = 0; li < byLayer.length - 1; li++) {
        for (const a of byLayer[li]) {
          for (const b of byLayer[li + 1]) {
            const na = nodes[a], nb = nodes[b];
            const heat = (na.fire + nb.fire) * 0.5;
            ctx.strokeStyle = heat > 0.05 ? `rgba(255,138,92,${0.04 + heat * 0.25})` : 'rgba(180,180,210,0.045)';
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.stroke();
          }
        }
      }

      // pulsos
      const alive: Pulse[] = [];
      for (const p of pulses) {
        p.t += p.speed * dt;
        const a = nodes[p.from], b = nodes[p.to];
        if (p.t >= 1) {
          b.fire = 1;
          if (Math.random() < 0.85) spawnFrom(p.to, Math.random() < 0.35 ? 2 : 1);
          continue;
        }
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        // rastro
        const tx = a.x + (b.x - a.x) * Math.max(0, p.t - 0.18);
        const ty = a.y + (b.y - a.y) * Math.max(0, p.t - 0.18);
        const g = ctx.createLinearGradient(tx, ty, x, y);
        g.addColorStop(0, color(p.hue, 0));
        g.addColorStop(1, color(p.hue, 0.9));
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = color(p.hue, 1);
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        alive.push(p);
      }
      pulses = alive.slice(-260);

      // neurônios
      for (const n of nodes) {
        const r = 2.6 + n.fire * 2.4;
        if (n.fire > 0.05) {
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 22 * n.fire + 4);
          glow.addColorStop(0, `rgba(255,138,92,${0.45 * n.fire})`);
          glow.addColorStop(1, 'rgba(255,138,92,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 22 * n.fire + 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = n.fire > 0.1 ? `rgba(255,${Math.round(210 - 80 * n.fire)},${Math.round(190 - 120 * n.fire)},1)` : 'rgba(150,150,180,0.55)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (now - lastWave > 1100) { wave(); lastWave = now; }
      if (visible) raf = requestAnimationFrame(draw);
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduced) { last = performance.now(); raf = requestAnimationFrame(draw); }
    });
    io.observe(canvas);

    if (reduced) {
      // um quadro estático com alguns neurônios acesos
      byLayer.flat().forEach((id) => { if (Math.random() < 0.25) nodes[id].fire = 0.7; });
      visible = false;
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
