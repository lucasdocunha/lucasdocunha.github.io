import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface SectionProps {
  id: string;
  title?: string;
  heading?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, title, heading, children, className = '' }: SectionProps) {
  const { ref, inView } = useInView();

  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div
        ref={ref}
        className={`section-container reveal ${inView ? 'is-visible' : ''}`}
      >
        {title && <p className="section-title">{title}</p>}
        {heading && <h2 className="section-heading">{heading}</h2>}
        {children}
      </div>
    </section>
  );
}
