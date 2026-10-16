import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface AnimatedContactHeadingProps {
  text: string;
}

export default function AnimatedContactHeading({ text }: AnimatedContactHeadingProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const qRef = useRef<HTMLSpanElement>(null);
  const waveTlRef = useRef<gsap.core.Timeline | null>(null);
  const isSpinningRef = useRef(false);

  // Split into words and characters so line wrapping never breaks inside a word
  const words = text.split(' ').reduce<{ text: string; start: number }[]>((acc, word) => {
    const prev = acc[acc.length - 1];
    acc.push({ text: word, start: prev ? prev.start + Array.from(prev.text).length + 1 : 0 });
    return acc;
  }, []);

  const { contextSafe } = useGSAP({ scope: containerRef, dependencies: [text] });

  // Spin question mark exactly 360 degrees and cleanly return to original position
  const spinQuestion = contextSafe((interactive = false) => {
    if (!qRef.current || isSpinningRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    isSpinningRef.current = true;
    gsap.killTweensOf(qRef.current);

    gsap.fromTo(
      qRef.current,
      { rotate: 0, x: 0, y: 0, scale: 1 },
      {
        rotate: 360,
        duration: interactive ? 0.6 : 0.72,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(qRef.current, { rotate: 0, x: 0, y: 0, scale: 1, clearProps: 'all' });
          isSpinningRef.current = false;
        },
      }
    );
  });

  // Autonomous spin every 3 seconds while in viewport
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let isVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible && !interval) {
          // Trigger one initial entrance spin
          spinQuestion(false);

          interval = setInterval(() => {
            if (isVisible && !document.hidden) {
              spinQuestion(false);
            }
          }, 3000);
        } else if (!isVisible && interval) {
          clearInterval(interval);
          interval = null;
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  // Autonomous wave animation across all letters of the title
  useGSAP(
    () => {
      const visuals = gsap.utils.toArray<HTMLElement>('.contact-char-visual');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const wave = gsap.timeline({
          repeat: -1,
          repeatDelay: 3.2,
          delay: 0.8,
        });

        wave.to(visuals, {
          y: -6,
          scale: 1.07,
          filter: 'brightness(1.2)',
          duration: 0.22,
          ease: 'sine.inOut',
          stagger: {
            each: 0.045,
            yoyo: true,
            repeat: 1,
          },
          onComplete: () => {
            gsap.set(visuals, { clearProps: 'transform,filter' });
          },
        });

        waveTlRef.current = wave;
      });

      return () => {
        mm.revert();
        waveTlRef.current?.kill();
      };
    },
    { scope: containerRef, dependencies: [text] }
  );

  // Pause autonomous wave when hovering letters
  const handleContainerEnter = contextSafe(() => {
    waveTlRef.current?.pause();
  });

  // Resume autonomous wave after cursor leaves
  const handleContainerLeave = contextSafe(() => {
    if (!waveTlRef.current) return;
    const visuals = gsap.utils.toArray<HTMLElement>('.contact-char-visual');
    gsap.to(visuals, {
      y: 0,
      scale: 1,
      filter: 'brightness(1)',
      duration: 0.25,
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(visuals, { clearProps: 'transform,filter' });
        waveTlRef.current?.resume();
      },
    });
  });

  // Interactive wave on characters when mouse moves across them (NO ROTATION!)
  const handleCharHover = contextSafe((charIndex: number) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!containerRef.current) return;

    const currentVisual = containerRef.current.querySelector<HTMLElement>(
      `[data-char-idx="${charIndex}"] .contact-char-visual`
    );
    if (!currentVisual) return;

    gsap.killTweensOf(currentVisual);
    gsap.to(currentVisual, {
      y: -8,
      scale: 1.12,
      filter: 'brightness(1.35)',
      duration: 0.16,
      ease: 'power2.out',
      overwrite: 'auto',
      onComplete: () => {
        gsap.to(currentVisual, {
          y: 0,
          scale: 1,
          filter: 'brightness(1)',
          duration: 0.45,
          ease: 'elastic.out(1.15, 0.45)',
          overwrite: 'auto',
          clearProps: 'transform,filter',
        });
      },
    });

    // Ripple to neighbor characters
    [-1, 1].forEach((offset) => {
      const neighborIdx = charIndex + offset;
      const neighbor = containerRef.current?.querySelector<HTMLElement>(
        `[data-char-idx="${neighborIdx}"] .contact-char-visual`
      );
      if (neighbor) {
        gsap.killTweensOf(neighbor);
        gsap.to(neighbor, {
          y: -4,
          scale: 1.05,
          filter: 'brightness(1.18)',
          duration: 0.16,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.to(neighbor, {
              y: 0,
              scale: 1,
              filter: 'brightness(1)',
              duration: 0.4,
              ease: 'elastic.out(1.1, 0.45)',
              overwrite: 'auto',
              clearProps: 'transform,filter',
            });
          },
        });
      }
    });
  });

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleContainerEnter}
      onMouseLeave={handleContainerLeave}
      className="inline-block [perspective:800px]"
      aria-label={`${text}?`}
    >
      {words.map((word, w) => {
        const isLast = w === words.length - 1;
        return (
          <span key={w} className="inline-block whitespace-nowrap" aria-hidden="true">
            {Array.from(word.text).map((ch, c) => {
              const i = word.start + c;
              return (
                <span
                  key={i}
                  data-char-idx={i}
                  onMouseEnter={() => handleCharHover(i)}
                  className="inline-block cursor-pointer select-none py-1 px-[0.5px]"
                >
                  <span className="contact-char-visual inline-block will-change-transform transform-gpu text-white">
                    {ch}
                  </span>
                </span>
              );
            })}
            {isLast && (
              <span
                className="inline-block relative ml-1 select-none align-baseline"
                style={{ perspective: 600 }}
              >
                <span
                  ref={qRef}
                  onMouseEnter={() => spinQuestion(true)}
                  onClick={() => spinQuestion(true)}
                  aria-hidden="true"
                  title="Bora conversar?"
                  className="inline-block text-accent-400 hover:text-accent-300 cursor-pointer transition-colors will-change-transform font-bold"
                  style={{
                    transformOrigin: '50% 50%',
                    display: 'inline-block',
                  }}
                >
                  ?
                </span>
              </span>
            )}
            {!isLast && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </span>
  );
}
