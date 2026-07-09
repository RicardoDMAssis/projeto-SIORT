import { useState, useEffect } from 'react';

/**
 * Custom scroll spy hook to track active section ID on scroll.
 * Optimized with throttling to prevent layout thrashing and high CPU usage.
 * @param {string[]} ids - List of element IDs to track.
 * @param {number} offset - Scroll offset to trigger active state in pixels.
 * @returns {string} The active section ID.
 */
export default function useScrollSpy(ids, offset = 160) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    let lastScrollTime = 0;
    let timeoutId = null;

    const runScrollCheck = () => {
      const scrollPosition = window.scrollY + offset;
      let currentSection = '';
      
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          // If current scroll position falls within the section bounds
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = id;
          }
        }
      }

      // Special case: very top of the page should activate the first ID
      if (window.scrollY < 80 && ids.length > 0) {
        currentSection = ids[0];
      }

      // Special case: scrolled to the bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        currentSection = ids[ids.length - 1];
      }

      if (currentSection) {
        setActiveId((prev) => (prev !== currentSection ? currentSection : prev));
      }
    };

    const handleScroll = () => {
      const now = Date.now();
      // Throttle to 100ms
      if (now - lastScrollTime >= 100) {
        runScrollCheck();
        lastScrollTime = now;
      } else {
        // Ensure the last scroll position is captured after scroll stops
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          runScrollCheck();
          lastScrollTime = Date.now();
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initially to capture current position
    runScrollCheck();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [ids, offset]); // Removed activeId to prevent effect re-running on state change

  return activeId;
}
