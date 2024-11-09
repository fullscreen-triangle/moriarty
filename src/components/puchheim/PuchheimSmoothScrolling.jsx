import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SmoothScrollSection = ({ children }) => {
  const containerRef = useRef(null);
  const siteHeaderRef = useRef(null);
  
  // Handle all GSAP-related setup in useGSAP
  useGSAP(() => {
    // Initialize ScrollSmoother
    ScrollTrigger.normalizeScroll(true);
    const smoother = ScrollSmoother.create({
      smooth: 3,
      speed: 1.3,
      effects: true,
    });

    // Set CSS custom property for header height
    const updateHeaderHeight = () => {
      if (siteHeaderRef.current) {
        const height = siteHeaderRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--siteHeader-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    // Handle sticky elements
    const stickyTracks = containerRef.current.querySelectorAll('.stickyTrack');
    const stickyElements = containerRef.current.querySelectorAll('.stickyEl');

    const scrollTriggers = [];

    stickyElements.forEach((el, index) => {
      const trigger = ScrollTrigger.create({
        trigger: el,
        pin: el,
        start: () => `-=${gsap.getProperty(":root", "--siteHeader-height")}`,
        end: () => `+=${stickyTracks[index].offsetHeight - el.offsetHeight}`,
        pinSpacing: false,
      });
      scrollTriggers.push(trigger);
    });

    // Cleanup function
    return () => {
      smoother.kill();
      window.removeEventListener('resize', updateHeaderHeight);
      scrollTriggers.forEach(trigger => trigger.kill());
    };
  }, { scope: containerRef });

  return (
    <>
      <header ref={siteHeaderRef} id="siteHeader" className="site-header">
        {/* Header content goes here */}
      </header>
      <div ref={containerRef} className="smooth-scroll-container">
        {children}
      </div>
    </>
  );
};

// Example usage component showing how to use sticky elements
const ExampleUsage = () => {
  return (
    <SmoothScrollSection>
      <div className="stickyTrack">
        <div className="stickyEl">
          {/* Your sticky content goes here */}
          <h2>Sticky Section 1</h2>
          <p>This content will stick while scrolling</p>
        </div>
      </div>
      
      <div className="stickyTrack">
        <div className="stickyEl">
          {/* Another sticky section */}
          <h2>Sticky Section 2</h2>
          <p>This is another sticky section</p>
        </div>
      </div>
      
      {/* Add more content as needed */}
    </SmoothScrollSection>
  );
};

export { SmoothScrollSection, ExampleUsage };