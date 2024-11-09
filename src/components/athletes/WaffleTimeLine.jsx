import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger)

const WaffleChart = ({ data, title }) => {
  // Increased sizes to fill the pinned section
  const squareWidth = 20;  // Increased from 5
  const gap = 4;          // Increased from 1
  const gridSize = 10;    // 10x10 grid
  const svgWidth = gridSize * (squareWidth + gap) + gap;
  const svgHeight = gridSize * (squareWidth + gap) + gap;

  const generateSquares = (startIdx, endIdx, color) => {
    const squares = [];
    for (let i = startIdx; i < endIdx; ++i) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      squares.push(
        <rect
          key={i}
          fill={color}
          x={col * (squareWidth + gap)}
          y={row * (squareWidth + gap)}
          width={squareWidth}
          height={squareWidth}
          className="transition-all duration-300"
        />
      );
    }
    return squares;
  };

  let currentPosition = 0;
  const squares = data.map(category => {
    const startPos = currentPosition;
    currentPosition += category.percentage;
    return generateSquares(startPos, currentPosition, category.color);
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto"
          >
            <g transform={`translate(${gap}, ${gap})`}>
              {squares}
            </g>
          </svg>
          
          <div className="flex flex-wrap gap-6">
            {data.map((category, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-6 h-6" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-lg">
                  {category.label} ({category.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ScrollTriggerTimeline = () => {
  const container = useRef();
  const chartRef = useRef();
  const lastContentRef = useRef(null);
  
  // Dataset for each year
  const datasets = {
    1990: [
      { label: 'Category A', percentage: 40, color: '#FFD700' },
      { label: 'Category B', percentage: 30, color: '#4CAF50' },
      { label: 'Category C', percentage: 20, color: '#2196F3' },
      { label: 'Category D', percentage: 10, color: '#9E9E9E' }
    ],
    1992: [
      { label: 'Category A', percentage: 25, color: '#FFD700' },
      { label: 'Category B', percentage: 35, color: '#4CAF50' },
      { label: 'Category C', percentage: 25, color: '#2196F3' },
      { label: 'Category D', percentage: 15, color: '#9E9E9E' }
    ],
    1997: [
      { label: 'Category A', percentage: 30, color: '#FFD700' },
      { label: 'Category B', percentage: 20, color: '#4CAF50' },
      { label: 'Category C', percentage: 30, color: '#2196F3' },
      { label: 'Category D', percentage: 20, color: '#9E9E9E' }
    ],
    1999: [
      { label: 'Category A', percentage: 15, color: '#FFD700' },
      { label: 'Category B', percentage: 35, color: '#4CAF50' },
      { label: 'Category C', percentage: 35, color: '#2196F3' },
      { label: 'Category D', percentage: 15, color: '#9E9E9E' }
    ],
    2000: [
      { label: 'Category A', percentage: 20, color: '#FFD700' },
      { label: 'Category B', percentage: 30, color: '#4CAF50' },
      { label: 'Category C', percentage: 25, color: '#2196F3' },
      { label: 'Category D', percentage: 25, color: '#9E9E9E' }
    ]
  };

  useGSAP(() => {
    gsap.defaults({ overwrite: 'auto' });
    
    const contentMarkers = gsap.utils.toArray('.vert-timeline__text');
    
    const st = ScrollTrigger.create({
      trigger: '.vert-timeline__wrap',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: getCurrentSection,
      pin: '.vert-timeline__chart-wrap',
      pinSpacing: false
    });

    contentMarkers.forEach((marker) => {
      const year = marker.querySelector('.vert-timeline__year').textContent;
      marker.dataset.year = year;
      
      marker.enter = () => {
        gsap.fromTo(
          chartRef.current,
          { opacity: 0, scale: 0.95 },
          { 
            duration: 0.5, 
            opacity: 1, 
            scale: 1,
            ease: "power2.out"
          }
        );
      };
      
      marker.leave = () => {
        gsap.to(chartRef.current, { 
          duration: 0.3, 
          opacity: 0,
          scale: 0.95,
          ease: "power2.in"
        });
      };
    });

    function getCurrentSection() {
      let newContent;
      const currScroll = window.scrollY;

      contentMarkers.forEach((marker) => {
        if (currScroll > marker.getBoundingClientRect().top) {
          newContent = marker;
        }
      });

      if (newContent && (!lastContentRef.current || !newContent.isSameNode(lastContentRef.current))) {
        const year = newContent.dataset.year;
        if (lastContentRef.current) {
          lastContentRef.current.leave();
        }
        setTimeout(() => {
          chartRef.current.dataset.currentYear = year;
          newContent.enter();
        }, 300);
        lastContentRef.current = newContent;
      }
    }

    const media = window.matchMedia('screen and (max-width: 600px)');
    const checkSTState = () => {
      if (media.matches) {
        st.disable();
      } else {
        st.enable();
      }
    };

    ScrollTrigger.addEventListener('refreshInit', checkSTState);
    checkSTState();

    return () => {
      st.kill();
      ScrollTrigger.removeEventListener('refreshInit', checkSTState);
    };
  }, { scope: container });

  return (
    <div ref={container}>
      <div className="header">
        <h1>header</h1>
      </div>
      <div className="section">
        <div className="vert-timeline">
          <div className="vert-timeline__wrap">
            <div className="vert-timeline__left">
              <div className="vert-timeline__text">
                <div className="vert-timeline__year">1990</div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
                  officiis ipsa earum dolores eum distinctio.
                </p>
              </div>
              <div className="vert-timeline__text">
                <div className="vert-timeline__year">1992</div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
                  officiis ipsa earum dolores eum distinctio.
                </p>
              </div>
              <div className="vert-timeline__text">
                <div className="vert-timeline__year">1997</div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
                  officiis ipsa earum dolores eum distinctio.
                </p>
              </div>
              <div className="vert-timeline__text">
                <div className="vert-timeline__year">1999</div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
                  officiis ipsa earum dolores eum distinctio.
                </p>
              </div>
              <div className="vert-timeline__text">
                <div className="vert-timeline__year">2000</div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
                  officiis ipsa earum dolores eum distinctio.
                </p>
              </div>
            </div>
            <div className="vert-timeline__chart-wrap" ref={chartRef}>
              <WaffleChart 
                data={datasets[chartRef.current?.dataset.currentYear || '1990']}
                title={`Distribution in ${chartRef.current?.dataset.currentYear || '1990'}`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h2>Section Heading</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra
          efficitur augue, ac sagittis dui viverra vitae.
        </p>
      </div>
      <div className="footer" />
    </div>
  );
};

export default ScrollTriggerTimeline;