import React, { useRef } from 'react';
import useIsomorphicLayoutEffect from '@/components/Hooks/useIsomorphicLayoutEffect';
import gsap from 'gsap/dist/gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger only on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AnimatedSection = ({
  children,
  animation: animationType = 'fadeIn', // Renamed parameter
  duration = 1,
  delay = 0,
  className = ''
}) => {
  const containerRef = useRef(null);

  const animations = {
    fadeIn: {
      opacity: 0,
      y: 50,
    },
    slideIn: {
      x: -100,
      opacity: 0,
    },
    scaleIn: {
      scale: 0.8,
      opacity: 0,
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const animation = gsap.from(containerRef.current, {
        ...animations[animationType],
        duration,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse'
        }
      });

      return () => {
        animation.kill();
        ctx.revert(); // This will clean up the ScrollTrigger instances
      };
    }, containerRef);

    return () => ctx.revert();
  }, [animationType, duration, delay]); // Updated dependency array

  return (
    <div ref={containerRef} className={`transition-all ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedSection;