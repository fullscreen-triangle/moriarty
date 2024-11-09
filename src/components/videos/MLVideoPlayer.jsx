'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { Loader2 } from 'lucide-react';
import  AnimatedLoader  from '../AnimatedLoader';

const MLVideoPlayer = ({ videoSources, onLoadComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previousFramesRef = useRef([]);
  const footstrikesRef = useRef([]);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    
    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load({ base: 'mobilenet_v2' });
        if (mounted) {
          setModel(loadedModel);
          setIsModelLoading(false);
        }
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedData = () => {
      setIsVideoLoading(false);
      if (onLoadComplete) {
        onLoadComplete();
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [onLoadComplete]);

  const detectFootStrikes = (predictions, previousFrames) => {
    const footstrikes = [];
    
    predictions.forEach(prediction => {
      if (prediction.class === 'person') {
        const [x, y, width, height] = prediction.bbox;
        const footY = y + height; // Bottom of bounding box
        
        // Get previous positions for this person
        const previousPositions = previousFrames
          .map(frame => frame.find(p => 
            p.class === 'person' &&
            Math.abs(p.bbox[0] - x) < width/2 // Same person if x position is similar
          ))
          .filter(Boolean);

        if (previousPositions.length >= 3) {
          // Calculate vertical velocity
          const velocities = previousPositions.map((pos, i) => {
            if (i === 0) return 0;
            return pos.bbox[1] + pos.bbox[3] - (previousPositions[i-1].bbox[1] + previousPositions[i-1].bbox[3]);
          });

          // Detect when velocity changes from negative to positive (foot strike)
          if (velocities[velocities.length - 1] >= 0 && velocities[velocities.length - 2] < 0) {
            // Determine left/right based on movement direction
            const isRightFoot = (x - previousPositions[0].bbox[0]) > 0;
            footstrikes.push({
              x: x + width/2,
              y: footY,
              isRight: isRightFoot,
              timestamp: Date.now()
            });
          }
        }
      }
    });

    return footstrikes;
  };

  const drawDistances = (ctx, predictions) => {
    const maxDistance = 75; // Maximum distance to show connection

    predictions.forEach((person1, i) => {
      if (person1.class !== 'person') return;

      predictions.slice(i + 1).forEach(person2 => {
        if (person2.class !== 'person') return;

        const [x1, y1, w1, h1] = person1.bbox;
        const [x2, y2, w2, h2] = person2.bbox;

        // Calculate centers
        const center1 = {
          x: x1 + w1/2,
          y: y1 + h1/2
        };
        const center2 = {
          x: x2 + w2/2,
          y: y2 + h2/2
        };

        // Calculate distance
        const dx = center2.x - center1.x;
        const dy = center2.y - center1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          // Draw line between people
          ctx.beginPath();
          ctx.moveTo(center1.x, center1.y);
          ctx.lineTo(center2.x, center2.y);
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw distance text
          const midX = (center1.x + center2.x) / 2;
          const midY = (center1.y + center2.y) / 2;
          ctx.fillStyle = 'red';
          ctx.font = '14px Arial';
          ctx.fillText(`${Math.round(distance)}px`, midX, midY);
        }
      });
    });
  };

  const drawFootStrikes = (ctx) => {
    // Only keep footstrikes from last 5 seconds
    const currentTime = Date.now();
    footstrikesRef.current = footstrikesRef.current.filter(
      strike => currentTime - strike.timestamp < 5000
    );

    footstrikesRef.current.forEach(strike => {
      ctx.beginPath();
      ctx.arc(strike.x, strike.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = strike.isRight ? 'blue' : 'green';
      ctx.fill();
    });
  };

  useEffect(() => {
    if (!isModelLoading && !isVideoLoading && videoRef.current && canvasRef.current && model) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const drawFrame = async () => {
        if (!isPlaying) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
          const predictions = await model.detect(canvas);
          
          // Update previous frames for foot strike detection
          previousFramesRef.current.push(predictions);
          if (previousFramesRef.current.length > 10) {
            previousFramesRef.current.shift();
          }

          // Detect new foot strikes
          const newFootStrikes = detectFootStrikes(predictions, previousFramesRef.current);
          footstrikesRef.current = [...footstrikesRef.current, ...newFootStrikes];

          // Draw all visual elements
          drawBoundingBoxes(ctx, predictions);
          drawDistances(ctx, predictions);
          drawFootStrikes(ctx);
        } catch (error) {
          console.error('Detection error:', error);
        }

        animationFrameRef.current = requestAnimationFrame(drawFrame);
      };

      if (isPlaying) {
        drawFrame();
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isModelLoading, isVideoLoading, model, isPlaying]);

  const drawBoundingBoxes = (ctx, predictions) => {
    predictions.forEach(prediction => {
      if (prediction.class === 'person') {
        const [x, y, width, height] = prediction.bbox;
        const text = `Person ${Math.round(prediction.score * 100)}%`;

        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = '#00FF00';
        ctx.font = '16px Arial';
        ctx.fillText(text, x, y > 10 ? y - 5 : 10);
      }
    });
  };

  const handlePlayPause = () => {
    if (!isModelLoading && !isVideoLoading) {
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative w-full">
      {(isModelLoading || isVideoLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-center">
            <AnimatedLoader className="w-8 h-8 animate-pulse mx-auto mb-2" />
            <p>{isModelLoading ? 'Loading ML Model...' : 'Loading Video...'}</p>
          </div>
        </div>
      )}
      
      <div className="relative">
        <video
          ref={videoRef}
          className="opacity-0 absolute inset-0 w-full h-full"
          muted
          playsInline
        >
          {videoSources.map((source, index) => (
            <source key={index} src={source.src} type={source.type} />
          ))}
          Your browser does not support the video tag.
        </video>
        
        <canvas
          ref={canvasRef}
          className="w-full"
          width="1280"
          height="720"
        />
        
        <button
          onClick={handlePlayPause}
          disabled={isModelLoading || isVideoLoading}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default MLVideoPlayer;