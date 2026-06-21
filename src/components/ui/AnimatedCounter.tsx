import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  id: string;
  targetValue: number;
  suffix: string;
  duration?: number; // duration in ms
}

export default function AnimatedCounter({ id, targetValue, suffix, duration = 1800 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const wasTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !wasTriggered.current) {
          wasTriggered.current = true;
          let startTimestamp: number | null = null;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function - easeOutQuad
            const easeProgress = progress * (2 - progress);
            
            setCount(Math.floor(easeProgress * targetValue));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(targetValue);
            }
          };
          
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [targetValue, duration]);

  return (
    <div ref={elementRef} id={id} className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none">
      <span className="text-brand-blue bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent">
        {count}
      </span>
      <span className="text-brand-teal font-extrabold ml-1">{suffix}</span>
    </div>
  );
}
