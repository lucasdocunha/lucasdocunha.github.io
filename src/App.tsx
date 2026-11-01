import { useEffect, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import { LangProvider, useLang } from '@/lib/lang';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Focus from '@/components/Focus';
import ClaudeCode from '@/components/ClaudeCode';
import Research from '@/components/Research';
import Path from '@/components/Path';
import Contact from '@/components/Contact';

/** Brilho suave que segue o cursor pela página inteira. */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      if (ref.current) ref.current.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,107,61,0.06),transparent_60%)] hidden md:block" />;
}

function Footer() {
  const { c } = useLang();
  return (
    <footer className="border-t border-ink-800 py-8">
      <div className="wrap flex flex-col items-center justify-between gap-2 font-mono text-xs text-ink-600 sm:flex-row">
        <span>© {new Date().getFullYear()} Lucas Cunha</span>
        <span>{c.footer}</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LangProvider>
        <div className="grain" aria-hidden />
        <CursorGlow />
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <Focus />
          <ClaudeCode />
          <Research />
          <Path />
          <Contact />
        </main>
        <Footer />
      </LangProvider>
    </MotionConfig>
  );
}
