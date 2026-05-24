import { useEffect, useState } from "react";

/**
 * React hook that returns the index of the element (matching the given CSS selector)
 * that is currently closest to the vertical center of the viewport.
 * 
 * @param selector CSS selector to query observed elements (e.g. '.project-card')
 * @param enabled Whether the scroll-spy logic is active (e.g. only on mobile)
 */
export function useActiveOnScroll(selector: string, enabled: boolean = true) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveIndex(null);
      return;
    }

    const checkActive = () => {
      const elements = Array.from(document.querySelectorAll(selector));
      if (elements.length === 0) {
        setActiveIndex(null);
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      let closestIndex: number | null = null;
      let minDistance = Infinity;

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        
        // Calculate the vertical center of the element relative to viewport
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        // Only consider elements that are visible in the viewport
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport && distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    // Run initial assessment
    checkActive();

    let frameId: number;
    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(checkActive);
    };

    // Listen to scroll and resize events
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Occasional polling to handle dynamically rendered content or layout updates
    const intervalId = setInterval(checkActive, 1000);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearInterval(intervalId);
    };
  }, [selector, enabled]);

  return activeIndex;
}
