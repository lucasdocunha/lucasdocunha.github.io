import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

let introPlayed = false;

interface AnimatedNameProps {
  name: string;
}

export default function AnimatedName({ name }: AnimatedNameProps) {
  const root = useRef<HTMLSpanElement>(null);
  const total = Array.from(name).length;

  const { contextSafe } = useGSAP(
    () => {
      const visuals = gsap.utils.toArray<HTMLElement>('.name-char-visual');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!introPlayed) {
          gsap.from(visuals, {
            opacity: 0,
            y: 40,
            rotateX: -70,
            filter: 'blur(6px)',
            transformOrigin: '50% 100%',
            duration: 0.85,
            ease: 'back.out(1.8)',
            stagger: 0.045,
            delay: 0.12,
          });
          introPlayed = true;
        }
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  // Smooth letter hover interaction with neighbor dispersion (wave) effect
  const handleCharHover = contextSafe((charIndex: number) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!root.current) return;

    const currentVisual = root.current.querySelector<HTMLElement>(
      `[data-char-idx="${charIndex}"] .name-char-visual`
    );
    if (!currentVisual) return;

    // Animate the hovered character smoothly from its current state (no snap to 0)
    gsap.killTweensOf(currentVisual);
    gsap.to(currentVisual, {
      y: -14,
      scale: 1.18,
      filter: 'brightness(1.25)',
      duration: 0.18,
      ease: 'power2.out',
      overwrite: 'auto',
      onComplete: () => {
        gsap.to(currentVisual, {
          y: 0,
          scale: 1,
          filter: 'brightness(1)',
          duration: 0.65,
          ease: 'elastic.out(1.15, 0.45)',
          overwrite: 'auto',
        });
      },
    });

    // Wave ripple on immediate neighbors
    [-1, 1].forEach((offset) => {
      const neighborIdx = charIndex + offset;
      const neighbor = root.current?.querySelector<HTMLElement>(
        `[data-char-idx="${neighborIdx}"] .name-char-visual`
      );
      if (neighbor) {
        gsap.killTweensOf(neighbor);
        gsap.to(neighbor, {
          y: -6,
          scale: 1.07,
          filter: 'brightness(1.12)',
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.to(neighbor, {
              y: 0,
              scale: 1,
              filter: 'brightness(1)',
              duration: 0.5,
              ease: 'elastic.out(1.1, 0.45)',
              overwrite: 'auto',
            });
          },
        });
      }
    });
  });

  // Split into words so line wrapping never breaks inside a word.
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
                data-char-idx={i}
                onMouseEnter={() => handleCharHover(i)}
                className="name-char-box inline-block cursor-pointer select-none py-1.5 px-[0.5px]"
              >
                <span
                  className="name-char-visual inline-block will-change-transform transform-gpu
                             bg-gradient-to-r from-accent-400 via-accent-300 to-secondary-400 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: `${total * 100}% 100%`,
                    backgroundPosition: `${total > 1 ? (i / (total - 1)) * 100 : 0}% 0`,
                  }}
                >
                  {ch}
                </span>
              </span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
