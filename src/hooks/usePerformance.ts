import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage?: number;
}

/**
 * Performance monitoring hook
 * Tracks FPS and render performance for optimization
 */
export const usePerformanceMonitor = (enabled: boolean = false) => {
  const metricsRef = useRef<PerformanceMetrics>({ fps: 60, renderTime: 0 });
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      frameCountRef.current++;

      // Update FPS every second
      if (delta >= 1000) {
        metricsRef.current.fps = Math.round((frameCountRef.current * 1000) / delta);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // Log performance metrics in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Performance] FPS: ${metricsRef.current.fps}`);

          // Check memory usage if available
          if ('memory' in performance) {
            const memory = (performance as any).memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            const totalMB = Math.round(memory.jsHeapSizeLimit / 1048576);
            console.log(`[Performance] Memory: ${usedMB}MB / ${totalMB}MB`);
          }
        }
      }

      rafRef.current = requestAnimationFrame(measurePerformance);
    };

    rafRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled]);

  return metricsRef.current;
};

/**
 * Debounce hook for performance optimization
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Throttle hook for performance optimization
 */
export const useThrottle = <T,>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};


