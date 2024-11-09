// VideoPlayer.js
import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ videoId, isFullscreen, onPlay }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isFullscreen && videoRef.current) {
      videoRef.current.play();
    } else if (!isFullscreen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isFullscreen]);

  return (
    <div className={`relative ${isFullscreen ? 'h-full' : 'h-64'}`}>
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${!isFullscreen && 'cursor-pointer'}`}
        muted
        playsInline
        onClick={() => !isFullscreen && onPlay()}
      >
        <source src={`/api/videos/${videoId}`} type="video/mp4" />
      </video>
      {!isFullscreen && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => onPlay()}
            className="p-4 bg-black/50 rounded-full hover:bg-black/70"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;