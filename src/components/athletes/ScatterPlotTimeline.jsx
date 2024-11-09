import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import * as d3 from "recharts";

gsap.registerPlugin(ScrollTrigger)

const ScrollTriggerTimeline = () => {
  const container = useRef();
  const chartRef = useRef();
  const lastContentRef = useRef(null);
  
  // Sample datasets for each year
  const datasets = {
    1990: [
      { x: 10, y: 20, category: "A" },
      { x: 15, y: 30, category: "B" },
      { x: 25, y: 40, category: "C" },
      { x: 35, y: 25, category: "D" },
    ],
    1992: [
      { x: 20, y: 40, category: "A" },
      { x: 25, y: 20, category: "B" },
      { x: 35, y: 30, category: "C" },
      { x: 45, y: 35, category: "D" },
    ],
    1997: [
      { x: 30, y: 30, category: "A" },
      { x: 35, y: 40, category: "B" },
      { x: 45, y: 20, category: "C" },
      { x: 55, y: 45, category: "D" },
    ],
    1999: [
      { x: 40, y: 50, category: "A" },
      { x: 45, y: 30, category: "B" },
      { x: 55, y: 40, category: "C" },
      { x: 65, y: 35, category: "D" },
    ],
    2000: [
      { x: 50, y: 40, category: "A" },
      { x: 55, y: 50, category: "B" },
      { x: 65, y: 30, category: "C" },
      { x: 75, y: 45, category: "D" },
    ],
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
        updateChart(datasets[year]);
        gsap.fromTo(
          chartRef.current,
          { opacity: 0 },
          { duration: 0.3, opacity: 1 }
        );
      };
      
      marker.leave = () => {
        gsap.to(chartRef.current, { duration: 0.1, opacity: 0 });
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
        if (lastContentRef.current) {
          lastContentRef.current.leave();
        }
        newContent.enter();
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

  // Function to update the scatterplot
  const updateChart = (data) => {
    const ScatterChart = d3.ScatterChart;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    return (
      <ScatterChart
        width={width}
        height={height}
        margin={margin}
        data={data}
      >
        <d3.CartesianGrid strokeDasharray="3 3" />
        <d3.XAxis type="number" dataKey="x" name="X Value" />
        <d3.YAxis type="number" dataKey="y" name="Y Value" />
        <d3.Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <d3.Scatter
          name="Data Points"
          data={data}
          fill="#8884d8"
        />
      </ScatterChart>
    );
  };

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
              {updateChart(datasets[1990])}
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