import { useState, useEffect, useRef } from 'react';

export const useAnimatedCounter = (
  targetValue: number,
  duration: number = 650,
  initialStartValue?: number
) => {
  const [displayValue, setDisplayValue] = useState<number>(
    initialStartValue !== undefined ? initialStartValue : targetValue
  );
  const previousValueRef = useRef<number>(displayValue);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const endValue = targetValue;
    const change = endValue - startValue;

    if (change === 0) return;

    const startTime = performance.now();

    // Subtle cubic easeOut
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentValue = startValue + change * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        previousValueRef.current = endValue;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
};
