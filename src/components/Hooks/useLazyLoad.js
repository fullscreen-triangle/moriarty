import { useState, useEffect, useRef } from 'react';

export const useLazyLoad = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '500px',
    unobserveOnEnter = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsVisible(true);
          setIsLoaded(true);
          if (unobserveOnEnter) {
            observer.unobserve(entry.target);
          }
        }
      },
      {
        root: null,
        threshold,
        rootMargin
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [threshold, rootMargin, unobserveOnEnter, isLoaded]);

  return { isVisible, isLoaded, containerRef };
};