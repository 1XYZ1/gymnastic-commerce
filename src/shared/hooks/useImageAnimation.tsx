/**
 * useImageAnimation Hook
 *
 * Custom hook that provides intersection observer functionality for image animations.
 * Animates images when they enter the viewport with support for prefers-reduced-motion.
 *
 * Features:
 * - Lazy loading with intersection observer
 * - Respects user's motion preferences (prefers-reduced-motion)
 * - Configurable threshold and root margin
 * - Automatic cleanup
 *
 * WCAG 2.1 AA Compliance:
 * - Respects prefers-reduced-motion media query
 * - Does not affect keyboard navigation
 * - Maintains semantic HTML structure
 *
 * @example
 * ```tsx
 * function ProductImage() {
 *   const { ref, isVisible } = useImageAnimation();
 *
 *   return (
 *     <div ref={ref}>
 *       <img
 *         src="/image.jpg"
 *         alt="Product"
 *         className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

import { useEffect, useRef, useState } from 'react';

interface UseImageAnimationOptions {
  /**
   * Threshold for intersection observer (0-1)
   * @default 0.1
   */
  threshold?: number;

  /**
   * Root margin for intersection observer
   * @default '50px'
   */
  rootMargin?: string;

  /**
   * Whether to trigger animation only once
   * @default true
   */
  triggerOnce?: boolean;
}

interface UseImageAnimationReturn {
  /**
   * Ref to attach to the container element
   */
  ref: React.RefObject<HTMLDivElement | null>;

  /**
   * Whether the element is visible in viewport
   */
  isVisible: boolean;

  /**
   * Whether animations should be disabled (prefers-reduced-motion)
   */
  prefersReducedMotion: boolean;
}

/**
 * Hook for implementing image entry animations with accessibility support
 */
export function useImageAnimation(
  options: UseImageAnimationOptions = {}
): UseImageAnimationReturn {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes in motion preference
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If user prefers reduced motion, show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);

            // If triggerOnce, unobserve after first intersection
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, prefersReducedMotion]);

  return {
    ref,
    isVisible,
    prefersReducedMotion,
  };
}
