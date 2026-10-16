import { useRef, type MouseEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// The intro only plays on first load, not when the language changes.
let introPlayed = false;

/**
 * Renders the name letter by letter and animates it with GSAP:
 * - 3D staggered intro on first load
 * - a subtle periodic wave
 * - letters jump when hovered
 */
export default function AnimatedName({ name }: { name: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const total = Array.from(name).length;

  const { contextSafe } = useGSAP(
    () => {
      const letters = gsap.utils.toArray<HTMLElement>('.name-char');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline();
        if (!introPlayed) {
          tl.from(letters, {
            opacity: 0,
            yPercent: 110,
            rotateX: -90,
            filter: 'blur(8px)',
            transformOrigin: '50% 100%',
            duration: 0.9,
            ease: 'back.out(1.7)',
            stagger: 0.05,
            delay: 0.15,
          });
          introPlayed = true;
        }
        // Gentle wave every few seconds to keep the name alive.
        tl.to(letters, {
          yPercent: -12,
          duration: 0.35,
          ease: 'sine.inOut',
          stagger: { each: 0.04, yoyo: true, repeat: 1 },
          repeat: -1,
          repeatDelay: 5,
          delay: 1.5,
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  const onEnter = contextSafe((e: MouseEvent<HTMLSpanElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      e.currentTarget,
      { y: 0, scale: 1 },
      {
        keyframes: [
          { y: -18, scale: 1.15, rotate: gsap.utils.random(-8, 8), duration: 0.18, ease: 'power2.out' },
          { y: 0, scale: 1, rotate: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' },
        ],
        overwrite: 'auto',
      }
    );
  });

  // Split into words so line wrapping never breaks inside a word.
  // `start` is each word's character offset in the full name (spaces included).
  const words = name.split(' ').reduce<{ text: string; start: number }[]>((acc, text) => {
    const prev = acc[acc.length - 1];
    acc.push({ text, start: prev ? prev.start + Array.from(prev.text).length + 1 : 0 });
    return acc;
  }, []);

  return (
    <span ref={root} className="inline-block [perspective:800px]" aria-label={name}>
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden="true">
          {Array.from(word.text).map((ch, c) => {
            const i = word.start + c;
            return (
              <span
                key={i}
                onMouseEnter={onEnter}
                className="name-char inline-block cursor-default will-change-transform
                           bg-gradient-to-r from-accent-400 via-accent-300 to-secondary-400 bg-clip-text text-transparent"
                // One continuous gradient across all letters.
                style={{
                  backgroundSize: `${total * 100}% 100%`,
                  backgroundPosition: `${total > 1 ? (i / (total - 1)) * 100 : 0}% 0`,
                }}
              >
                {ch}
              </span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
