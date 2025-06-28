import React, { useState, useEffect } from 'react';

interface CustomCursorProps {
  isDarkMode: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ isDarkMode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.classList.contains('cursor-pointer') ||
          target.closest('button') ||
          target.closest('a')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // Mouse position update
    window.addEventListener('mousemove', updateMousePosition);

    // Hover detection
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={`cursor ${isHovering ? 'hover' : ''}`}
      style={{
        left: mousePosition.x,
        top: mousePosition.y
      }}
    />
  );
};

export default CustomCursor;
