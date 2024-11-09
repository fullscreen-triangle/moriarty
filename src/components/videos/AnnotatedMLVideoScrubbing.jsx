import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import gsap, { Expo } from 'gsap/dist/gsap';

const sampleAnnotations = [
  { startTime: 0, endTime: 2, text: "Opening scene", position: { x: 20, y: 20 } },
  { startTime: 2, endTime: 4, text: "Transition effect", position: { x: 50, y: 50 } },
  { startTime: 4, endTime: 6, text: "Abstract patterns", position: { x: 30, y: 80 } },
];

const VideoScrubMLWithAnnotations = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [currentAnnotations, setCurrentAnnotations] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load({ base: 'mobilenet_v2' });
      setModel(loadedModel);
      setIsModelLoading(false);
    };

    loadModel();
  }, []);

  const updateAnnotations = (currentTime) => {
    const visibleAnnotations = sampleAnnotations.filter(
      annotation => 
        currentTime >= annotation.startTime && 
        currentTime <= annotation.endTime
    );
    setCurrentAnnotations(visibleAnnotations);
  };

  useEffect(() => {
    if (!isModelLoading && videoRef.current && canvasRef.current && model) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions to match container
      if (dimensions.width && dimensions.height) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
      }

      let tl;
      const gsapCtx = gsap.context(() => {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            markers: true,
            onUpdate: async (self) => {
              if (video.currentTime !== undefined) {
                updateAnnotations(video.currentTime);
              }
              
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Calculate aspect ratio scaling
              const scale = Math.max(
                canvas.width / video.videoWidth,
                canvas.height / video.videoHeight
              );
              const x = (canvas.width - video.videoWidth * scale) / 2;
              const y = (canvas.height - video.videoHeight * scale) / 2;
              
              // Draw video maintaining aspect ratio
              ctx.drawImage(
                video, 
                x, y, 
                video.videoWidth * scale,
                video.videoHeight * scale
              );
              
              const predictions = await model.detect(canvas);
              drawBbox(ctx, predictions, scale, { x, y });
            }
          },
        });
      });

      video.onloadedmetadata = function() {
        tl.fromTo(
          video,
          {
            currentTime: 0,
            ease: Expo.easeIn,
          },
          {
            currentTime: video.duration,
            ease: Expo.easeOut,
          }
        );
      };

      return () => gsapCtx.revert();
    }
  }, [isModelLoading, model, dimensions]);

  const drawBbox = (ctx, predictions, scale, offset) => {
    predictions.forEach(prediction => {
      if (prediction.class === 'person') {
        const [x, y, width, height] = prediction.bbox;
        
        // Scale and offset the bounding box
        const scaledX = x * scale + offset.x;
        const scaledY = y * scale + offset.y;
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0, 250, 0)';
        ctx.fillStyle = 'rgb(0, 250, 0)';
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        ctx.font = '16px Arial';
        ctx.fillText('Person', scaledX, scaledY - 5);
      }
    });
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[500vh]">
        <div 
          ref={containerRef}
          className="fixed inset-0 w-full h-full"
        >
          {isModelLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-xl">Loading Model...</div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* Hidden video element */}
              <video
                ref={videoRef}
                className="hidden"
                playsInline
                webkit-playsinline="true"
                preload="auto"
                muted
              >
                <source
                  src="https://www.dropbox.com/s/ob3iz14tgo29qns/Abstract%20-%2020072_960.mp4?raw=1"
                  type="video/mp4"
                />
              </video>
              
              {/* Full-screen canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
              ></canvas>

              {/* Text annotations overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {currentAnnotations.map((annotation, index) => (
                  <div
                    key={index}
                    className="absolute bg-black bg-opacity-50 text-white p-2 rounded"
                    style={{
                      left: `${annotation.position.x}%`,
                      top: `${annotation.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  >
                    {annotation.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoScrubMLWithAnnotations;