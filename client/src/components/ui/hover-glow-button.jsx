import React, { useRef, useState } from 'react';

export const HoverButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  glowColor = '#445D48',
  backgroundColor = '#445D48',
  textColor = '#FDE5D4',
  hoverTextColor = '#FDE5D4',
  ...props
}) => {
  const buttonRef = useRef(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setGlowPosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative inline-flex items-center justify-center px-8 py-4 border-none 
        cursor-pointer overflow-hidden transition-all duration-300 
        text-base font-extrabold rounded-2xl z-10 font-sans shadow-lg
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        backgroundColor: backgroundColor,
        color: isHovered ? hoverTextColor : textColor,
      }}
      {...props}
    >
      {/* Glow effect div */}
      <div
        className={`
          absolute w-[220px] h-[220px] rounded-full opacity-60 pointer-events-none 
          transition-transform duration-300 ease-out -translate-x-1/2 -translate-y-1/2
          ${isHovered ? 'scale-125' : 'scale-0'}
        `}
        style={{
          left: `${glowPosition.x}px`,
          top: `${glowPosition.y}px`,
          background: `radial-gradient(circle, ${glowColor} 15%, transparent 75%)`,
          zIndex: 0,
        }}
      />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

export default HoverButton;
