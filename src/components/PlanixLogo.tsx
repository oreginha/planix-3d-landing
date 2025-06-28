import React from 'react';

interface PlanixLogoProps {
  className?: string;
  isDarkMode: boolean;
}

const PlanixLogo: React.FC<PlanixLogoProps> = ({ className = '', isDarkMode }) => {
  return (
    <svg 
      className={`h-9 w-auto transform transition-all duration-500 hover:scale-110 cursor-pointer ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      } ${className}`} 
      viewBox="0 0 170 60" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDarkMode ? "#60A5FA" : "#3B82F6"} />
          <stop offset="50%" stopColor={isDarkMode ? "#8B5CF6" : "#6366F1"} />
          <stop offset="100%" stopColor={isDarkMode ? "#EC4899" : "#EC4899"} />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="animatedGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur">
            <animate attributeName="stdDeviation" 
              values="3;8;3" 
              dur="4s" 
              repeatCount="indefinite"/>
          </feGaussianBlur>
          <feOffset dx="0" dy="0" result="offsetBlur"/>
          <feFlood floodColor={isDarkMode ? "#60A5FA" : "#3B82F6"} floodOpacity="0.8">
            <animate attributeName="flood-opacity" 
              values="0.2;0.8;0.2" 
              dur="4s" 
              repeatCount="indefinite"/>
          </feFlood>
          <feComposite in2="offsetBlur" operator="in"/>
          <feMorphology operator="dilate" radius="2" result="dilated"/>
          <feGaussianBlur stdDeviation="4" in="dilated" result="softEdges"/>
          <feMerge> 
            <feMergeNode in="softEdges"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      

      
      {/* Text */}
      <g className="transition-all duration-300" transform="translate(-15, 5)">
        <path 
          className="fill-current" 
          d="M50.7,26.2c0,8.5-3.6,13.4-9.8,13.4c-3.2,0.1-6.1-1.9-7.2-4.9V49H22V13.6h10.7l0.3,5.4c1.4-3.6,4.2-5.9,8.1-5.9C47.2,13.1,50.7,17.9,50.7,26.2z M38.9,26.3c0-3.8-1-4.5-2.5-4.5s-2.6,1.3-2.6,4.5c0,3,0.9,4.5,2.6,4.5C37.9,30.8,38.9,30.1,38.9,26.3z"
          filter={isDarkMode ? "url(#animatedGlow)" : "none"}
        />
        <path 
          className="fill-current" 
          d="M65.5,3.2V27c0,2,0.5,2.9,2.1,2.9c0.5,0,1.1,0,1.6-0.1l0.3,8.1c-1.4,1-4.3,1.7-6.8,1.7c-6.3,0-8.8-2.4-8.8-9.1V3.2H65.5z"
          filter={isDarkMode ? "url(#animatedGlow)" : "none"}
        />
        <path 
          className="fill-current" 
          d="M100.4,32.3L100,38.6c-1.4,0.7-3,1-4.5,1c-3.8,0-6.7-1.2-7.8-4c-1.1,2.3-3.6,4-8.4,4c-5.8,0-8.6-3.5-8.6-7.6s3.3-7.4,9.1-7.4H86v-1.3c0.1-1.2-0.8-2.2-2-2.3c-0.1,0-0.2,0-0.3,0c-1.6,0-2.5,0.8-2.7,2.8l-10.4-2c1.4-5.7,5.5-8.8,13.9-8.8c8.8,0,13.2,4.1,13.2,9.9v7.5c0,1.4,0.6,2,2,2C99.9,32.5,100.2,32.4,100.4,32.3z M86.1,30.5V29h-1.5c-2.1,0-2.8,0.8-2.8,1.7c0,1.1,0.9,1.9,1.9,1.9C84.9,32.7,86.1,32.3,86.1,30.5z"
          filter={isDarkMode ? "url(#animatedGlow)" : "none"}
        />
        <path 
          className="fill-current" 
          d="M129.9,21.4v17.6H118.2V24.6c0-1.7-0.6-2.3-1.8-2.3c-1.7,0-2.4,1-2.4,3.3v13.5H102.2V13.6h10.6l0.2,5.9c1.5-4,4.5-6.4,8.9-6.4C127,13.1,129.9,16.2,129.9,21.4z"
          filter={isDarkMode ? "url(#animatedGlow)" : "none"}
        />
        <path 
          className="fill-current" 
          d="M146,7c0,3.4-2.1,4.9-6.3,4.9s-6.1-1.6-6.1-4.9s2-5,6.2-5S146,3.6,146,7z M145.5,13.6v25.5h-11.7V13.6H145.5z"
          filter={isDarkMode ? "url(#animatedGlow)" : "none"}
        />
        <path 
          className="fill-current" 
          d="M180.1,39.1h-13.8l-3-6.6l-3.3,6.6H147l8.9-12.3l-8.7-13.2h13.7l2.7,6.4l3.2-6.4h13l-8.8,12.5L180.1,39.1z"
          filter={isDarkMode ? "url(#animatedGlow)" : "none"}
        />
      </g>
    </svg>
  );
};

export default PlanixLogo;