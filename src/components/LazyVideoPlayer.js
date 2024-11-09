import { AnimatedLoader } from '@/components/AnimatedLoader';
import dynamic from 'next/dynamic';
import { useLazyLoad } from '@/components/Hooks/useLazyLoad.js';

// Dynamically import the MLVideoPlayer
const MLVideoPlayer = dynamic(
  () => import('@/components/videos/MLVideoPlayer'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <AnimatedLoader className="w-8 h-8 animate-pulse mx-auto mb-2"/>
        </div>
      </div>
    )
  }
);

export function LazyVideoPlayer({ videoSources, title }) {
  const { isVisible, containerRef } = useLazyLoad({
    threshold: 0.1,
    rootMargin: '500px'
  });

  return (
    <div ref={containerRef} className="w-full">
      {isVisible ? (
        <MLVideoPlayer 
          videoSources={videoSources}
          onLoadComplete={() => console.log(`${title} loaded`)}
        />
      ) : (
        <div className="w-full aspect-video bg-gray-900" />
      )}
    </div>
  );
}