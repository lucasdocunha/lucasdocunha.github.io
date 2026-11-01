import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Aparece ao entrar na viewport. */
export function Reveal({ children, delay = 0, className = '', y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ΣλΔ∇';

/** Texto que "decodifica" a partir de caracteres aleatórios. */
export function Scramble({ text, delay = 0, speed = 28, className = '' }: { text: string; delay?: number; speed?: number; className?: string }) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced ? text : '');

  useEffect(() => {
    if (reduced) { setOut(text); return; }
    let frame = 0;
    let raf = 0;
    let start: number | null = null;
    const total = text.length;
    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start - delay;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      frame = Math.floor(elapsed / speed);
      const revealed = Math.min(total, Math.floor(frame / 1.6));
      let s = '';
      for (let i = 0; i < total; i++) {
        if (text[i] === ' ') s += ' ';
        else if (i < revealed) s += text[i];
        else if (i < revealed + 6) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else s += ' ';
      }
      setOut(s);
      if (revealed < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, speed, reduced]);

  return <span className={className} aria-label={text}><span aria-hidden>{out}</span></span>;
}

/** Atualiza --mx/--my no elemento para o efeito .spotlight */
export function spotlightMove(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/** Botão/elemento "magnético" que puxa em direção ao cursor. */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={(e) => {
        if (reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={pos}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
