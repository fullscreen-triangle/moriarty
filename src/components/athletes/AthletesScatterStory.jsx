import React, { useEffect, useRef, useState } from 'react';
import { select, scaleTime, extent, timeParse } from 'd3';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AthleteScatterStory = () => {
  const [data, setData] = useState(null);
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);

  const svgWidth = 700;
  const svgHeight = 500;
  const circleRad = 10;
  
  // Rainbow colors for circles
  const rainbow = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];

  useEffect(() => {
    // Fetch and process data
    const fetchData = async () => {
      try {
        const response = await fetch('/json/senior/senior_men_four_hundred_indices.json');
        const jsonData = await response.json();
        const processedData = Object.entries(jsonData).map(([name, data], index) => ({
          id: index,
          name: name,
          mass: data.bsp_values.Mass.Total_arm,
          vo2: data.additional_metrics.VO2_Max,
          height: data.athlete_info.Height,
          weight: data.athlete_info.Weight
        }));
        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = select(svgRef.current);
    const g = svg.append('g');

    // Create initial circles with random positions
    const circles = g
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('class', 'points')
      .attr('r', 0)
      .attr('cx', () => Math.random() * svgWidth)
      .attr('cy', () => Math.random() * svgHeight)
      .style('fill', () => rainbow[Math.floor(Math.random() * rainbow.length)])
      .style('opacity', 0.7);

    // ScrollTrigger for step transitions
    const step1Animation = gsap.to('.points', {
      scrollTrigger: {
        trigger: step1Ref.current,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
      attr: { r: 8 },
      duration: 0.5,
      ease: 'power3.out'
    });

    // Transition to height vs weight scatter plot
    const step2Animation = gsap.to('.points', {
      scrollTrigger: {
        trigger: step2Ref.current,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
      attr: {
        cx: d => (d.height / 200) * svgWidth,
        cy: d => (1 - d.weight / 120) * svgHeight
      },
      duration: 0.8,
      ease: 'power3.inOut'
    });

    // Transition to VO2 Max vs Total Arm Mass
    const step3Animation = gsap.to('.points', {
      scrollTrigger: {
        trigger: step3Ref.current,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
      attr: {
        cx: d => (d.vo2 / 80) * svgWidth,
        cy: d => (1 - d.mass / 5) * svgHeight
      },
      duration: 0.8,
      ease: 'power3.inOut'
    });

    // Pin the visualization while scrolling through steps
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      endTrigger: step4Ref.current,
      start: 'center center',
      end: 'bottom center',
      pin: true,
      pinSpacing: false,
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      step1Animation.kill();
      step2Animation.kill();
      step3Animation.kill();
    };
  }, [data]);

  return (
    <div className="relative w-full">
      <div ref={wrapperRef} className="sticky top-0 w-full h-screen flex items-center justify-center">
        <svg
          ref={svgRef}
          className="w-full max-w-4xl"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
      
      <div className="relative z-10">
        <div ref={step1Ref} className="h-screen flex items-center p-8">
          <div className="bg-white/80 p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">Introducing the Athletes</h2>
            <p>Each point represents an Olympic athlete from our dataset.</p>
          </div>
        </div>

        <div ref={step2Ref} className="h-screen flex items-center p-8">
          <div className="bg-white/80 p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">Height vs Weight Distribution</h2>
            <p>See how height and weight vary across different athletes.</p>
          </div>
        </div>

        <div ref={step3Ref} className="h-screen flex items-center p-8">
          <div className="bg-white/80 p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">VO2 Max vs Arm Mass</h2>
            <p>Exploring the relationship between oxygen uptake and arm mass.</p>
          </div>
        </div>

        <div ref={step4Ref} className="h-screen flex items-center p-8">
          <div className="bg-white/80 p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">Analysis Complete</h2>
            <p>Final observations about the athletic data patterns.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteScatterStory;