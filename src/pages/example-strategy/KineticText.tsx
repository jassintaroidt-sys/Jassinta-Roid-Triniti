import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '../../lib/useMediaQuery';

interface KineticTitleProps {
  text: string;
  className?: string;
  delay?: number;
}

export const KineticTitle: React.FC<KineticTitleProps> = ({
  text,
  className = '',
  delay = 0,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const words = text.split(' ');

  if (prefersReducedMotion) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap items-baseline gap-x-[0.25em]">
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="overflow-hidden py-1 inline-block">
            <motion.span
              className="inline-block"
              initial={{ y: '105%', rotate: 2 }}
              animate={{ y: '0%', rotate: 0 }}
              transition={{
                duration: 0.85,
                delay: delay + wordIdx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </h1>
  );
};

interface CounterNumberProps {
  value: string;
  className?: string;
}

export const CounterNumber: React.FC<CounterNumberProps> = ({
  value,
  className = '',
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : '0');

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    if (!isInView) return;

    // Parse numeric part and suffix (e.g., "4000+" -> num: 4000, suffix: "+", "30K+" -> num: 30, suffix: "K+")
    const match = value.match(/^([\d,.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const numStr = match[1].replace(/,/g, '');
    const num = parseFloat(numStr);
    const suffix = match[2];

    if (isNaN(num)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1200; // ms
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);

      setDisplayValue(`${current.toLocaleString()}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    };

    const animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isInView, value, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
};
