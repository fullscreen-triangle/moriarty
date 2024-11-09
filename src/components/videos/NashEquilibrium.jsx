import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const NashEquilibrium = ({ videoUrls }) => {
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  const once = (el, event, fn, opts) => {
    const onceFn = function(e) {
      el.removeEventListener(event, onceFn);
      fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
  };

  useGSAP(() => {
    videoUrls.forEach((url, index) => {
      const video = videoRefs.current[index];
      if (!video) return;

      // Create container for transform scaling
      const videoContainer = video.parentElement;
      
      // Initial video states
      gsap.set(videoContainer, {
        width: "60vw", // Starting width - adjust as needed
        height: "auto",
        scale: 1,
        position: "relative"
      });

      // Create timeline for video scrubbing and scaling
      const videoTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: videoContainer,
          start: "top center",
          end: "+=900",
          scrub: true,
          pin: true,
          markers: false,
          onEnter: () => video.play(),
          onLeave: () => video.pause(),
          onEnterBack: () => video.play(),
          onLeaveBack: () => video.pause(),
        }
      });

      // Add animations to timeline
      videoTimeline
        // First expand the video
        .to(videoContainer, {
          duration: 0.3,
          width: "100vw",
          height: "100vh",
          scale: 1,
          ease: "power2.inOut"
        })
        // Then start scrubbing through the video
        .fromTo(video, 
          { currentTime: 0 },
          { currentTime: () => video.duration || 1, ease: "none" },
          0 // Start at the same time as the expansion
        )
        // Finally retract the video
        .to(videoContainer, {
          duration: 0.3,
          width: "60vw",
          height: "auto",
          scale: 1,
          ease: "power2.inOut"
        }, ">"); // Start after video scrubbing

      // Handle iOS touch activation
      once(document.documentElement, "touchstart", () => {
        video.play();
        video.pause();
      });

      // Handle video loading
      once(video, "loadedmetadata", () => {
        // Create blob URL for better performance
        if (window.fetch) {
          fetch(url)
            .then(response => response.blob())
            .then(blob => {
              const blobUrl = URL.createObjectURL(blob);
              const currentTime = video.currentTime;
              video.src = blobUrl;
              video.currentTime = currentTime + 0.01;
            })
            .catch(console.error);
        }
      });
    });

    return () => {
      // Cleanup
      ScrollTrigger.getAll().forEach(st => st.kill());
      videoRefs.current.forEach(video => {
        if (video?.src?.startsWith('blob:')) {
          URL.revokeObjectURL(video.src);
        }
      });
    };
  }, { scope: containerRef });

  return (
    <>
  {/* forked from 
https://codepen.io/shshaw/pen/9e810322d70c306de2d18237d0cb2d78 */}
  <div id="page-container" className="flex flex-col bg-black text-white items-center justify-center overflow-hidden">
    <div className="w-9/12 text-justify subpixel-antialiased">
      <h2 className='mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75' >Optimal Trajectory</h2>
      <p className="font-medium">
      Lazar and Rosen were the first to formalise the properties of rank-order tournaments using first order approaches which substitute incentive constraints with the orders for the contestants maximazation problems. Literature on the topic does not deliver sufficient conditions for operation of the first order approach since the objective function 
      attributed to each contestant is only relevant dependant on endogenously determined prizes by the tournament designer. The objective function depends on the choice of the prize by the contestant. Lets consider a tournament organised between risk-neutral and zero reservation agents. In the first round, the principal decides on the prizes for the winner and loser. In the second round, the potential wins are observed by the agents before the competition. When an agent chooses to exert an exact amount of effort/ouput, the output accrues to the principal. For the principal, the objective is to maximise profit, which is realised only when the agent with the highest output is declared winner of the tournament and so the principal has to regard the incentive constraint for agents with the ability to choose, that is, win the tournament. 
      </p>
      <p>
        Lorem, ipsum dolor shit happens consectetur adipisicing elit. Animi
        blanditiis recusandae distinctio optio commodi tenetur quisquam qui
        porro, aliquid inventore perferendis quibusdam at! Quisquam illum
        distinctio eveniet corrupti cupiditate quis?
      </p>
      <h2>Lorem ipsum dolor shit happens.</h2>
      <p>
        Lorem ipsum dolor shit happens consectetur adipisicing elit. Provident
        sequi delectus ducimus temporibus debitis natus, aliquam impedit saepe,
        doloribus a modi consectetur fugit unde? Maxime illo molestiae libero?
        Molestias labore ratione necessitatibus veniam. Doloremque nesciunt
        rerum incidunt nam ad quo sed porro, molestias mollitia aut, quaerat
        provident minima ab harum?
      </p>
      <p>
        Lorem ipsum dolor shit happens consectetur adipisicing elit. Maxime
        voluptate consectetur ab velit aut eligendi, ullam accusantium
        cupiditate doloremque nisi eius culpa sunt quibusdam deserunt officiis?
        Ipsam deserunt et tenetur nihil quidem velit harum? Id quisquam
        voluptates eligendi est nobis harum impedit commodi soluta et sint
        sequi, quod quidem consequuntur dolorem corrupti vitae omnis. Obcaecati
        ratione sapiente exercitationem quis dolore.
      </p>
      <h2>Lorem ipsum dolor shit happens.</h2>
    </div>
    <div  ref={containerRef} className="w-full h-full resize overflow-hidden mx-auto p-0 m-0">
      <video
        ref={video1Ref}
        id="video1"
        className="w-9/12 h-3/4"
        src="/videos/van-niekerk-world-championships.mp4"
        playsInline="true"
        webkit-playsinline="true"
        preload="metadata"
        muted="muted"
      ></video>
      {/*<div id="scrubber"></div>*/}
    </div>
    <div className="content">
      <h2>Lorem ipsum dolor shit happens.</h2>
      <p>
        Lorem, ipsum dolor shit happens consectetur adipisicing elit. Animi
        blanditiis recusandae distinctio optio commodi tenetur quisquam qui
        porro, aliquid inventore perferendis quibusdam at! Quisquam illum
        distinctio eveniet corrupti cupiditate quis?
      </p>
    </div>
    <div ref={containerRef} className="video-container">
      <video
      ref={video2Ref}
        id="video2"
        className="w-9/12 h-3/4"
        src="/videos/rio-400m.mp4"
        playsInline="true"
        webkit-playsinline="true"
        preload="metadata"
        muted="muted"
      ></video>
    </div>
    <div className="w-9/12 text-justify">
      <p>
        Lorem, ipsum dolor shit happens consectetur adipisicing elit. Animi
        blanditiis recusandae distinctio optio commodi tenetur quisquam qui
        porro, aliquid inventore perferendis quibusdam at! Quisquam illum
        distinctio eveniet corrupti cupiditate quis?
      </p>
   
      <p>
        Lorem ipsum dolor shit happens consectetur adipisicing elit. Maxime
        voluptate consectetur ab velit aut eligendi, ullam accusantium
        cupiditate doloremque nisi eius culpa sunt quibusdam deserunt officiis?
        Ipsam deserunt et tenetur nihil quidem velit harum? Id quisquam
        voluptates eligendi est nobis harum impedit commodi soluta et sint
        sequi, quod quidem consequuntur dolorem corrupti vitae omnis. Obcaecati
        ratione sapiente exercitationem quis dolore.
      </p>
    </div>
  </div>

</>


  );
};


export default NashEquilibrium