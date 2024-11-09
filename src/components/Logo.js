import React from 'react';

const Logo = ({ width = 600, height = 300 }) => {
  return (
    <svg
      version="1.2"
      height={height}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 300"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="logo-svg"
    >
      <path
        stroke="rgba(155,55,255,0.4)"
        fill="none"
        strokeWidth="5"
        strokeLinejoin="round"
        d="M0,90L150,90M150,90Q158,60 162,87T167,95 170,88 173,92t6,35 7,-60T190,127 197,107s2,-11 10,-10 1,1 8,-10T219,95c6,4 8,-6 10,-17s2,10 9,11h110"
      />
      <path
        id="longbeat"
        style={{
          stroke: '#00AEAA',
          fill: 'none',
          strokeWidth: 1,
          strokeLinejoin: 'round',
        }}
        d="M0,90L150,90M150,90Q158,60 162,87T167,95 170,88 173,92t6,35 7,-60T190,127 197,107s2,-11 10,-10 1,1 8,-10T219,95c6,4 8,-6 10,-17s2,10 9,11h110"
      />
      <rect x="-3" y="-4" height="8" width="6" rx="20" ry="20" fill="red">
        <animateMotion dur="2s" repeatCount="indefinite">
          <mpath xlinkHref="#longbeat" />
        </animateMotion>
      </rect>
      <style>{`
        .logo-svg {
          width: 100%;
          height: 100%;
        }
        #pulsar {
          stroke-dasharray: 281;
          animation: dash 2.5s infinite linear forwards;
        }
        #jugular {
          stroke-dasharray: 497;
          animation: dash 1.4s infinite ease forwards;
        }
        #bleed {
          stroke-dasharray: 437;
          animation: dash 1.2s infinite ease-out;
        }
        #flat {
          stroke-dasharray: 814;
          animation: dash 10s infinite linear;
        }
        @keyframes dash {
          from {
            stroke-dashoffset: 814;
          }
          to {
            stroke-dashoffset: -814;
          }
        }
      `}</style>
    </svg>
  );
};

export default Logo;