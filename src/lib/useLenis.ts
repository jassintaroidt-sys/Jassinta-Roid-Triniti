import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

let globalLenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return globalLenisInstance;
}

export function scrollToProgress(progress: number, options?: { immediate?: boolean; duration?: number }): void {
  if (typeof window === 'undefined') return;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const target = maxScroll * Math.min(Math.max(progress, 0), 1);
  
  if (globalLenisInstance) {
    globalLenisInstance.scrollTo(target, options);
  } else {
    window.scrollTo({
      top: target,
      behavior: options?.immediate ? 'auto' : 'smooth',
    });
  }
}

export function scrollToTop(immediate = true): void {
  if (globalLenisInstance) {
    globalLenisInstance.scrollTo(0, { immediate });
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
  }
}

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(globalLenisInstance);
  const rafHandleRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop / fine-pointer devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      return;
    }

    if (!globalLenisInstance) {
      const instance = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      globalLenisInstance = instance;
      setLenis(instance);

      function update(time: number) {
        instance.raf(time);
        rafHandleRef.current = requestAnimationFrame(update);
      }

      rafHandleRef.current = requestAnimationFrame(update);
    } else {
      setLenis(globalLenisInstance);
    }

    return () => {
      // Keep instance alive if other components use it or clean up on full unmount
    };
  }, []);

  return {
    lenis,
    scrollToProgress,
    scrollToTop,
  };
}
