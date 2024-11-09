import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AnimatedSection = ({ 
  children, 
  animation = 'fadeIn',
  duration = 1,
  delay = 0,
  className = ''
}) => {
  const container = useRef();
  
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

  useGSAP(() => {
    const element = container.current;
    
    gsap.from(element, {
      ...animations[animation],
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        end: 'bottom center',
        toggleActions: 'play none none reverse'
      }
    });
  }, { scope: container });

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  );
};