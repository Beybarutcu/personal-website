// src/components/ui/Card.jsx
import React from 'react';

const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = 'none',
  padding = 'default',
  shadow = 'default',
  border = true,
  ...props
}) => {
  // Base classes
  const baseClasses = 'rounded-xl backdrop-blur-md transition-all duration-300';
  
  // Variant classes
  const variantClasses = {
    default: 'bg-gray-800/40',
    dark: 'bg-gray-900/60',
    transparent: 'bg-transparent',
    cosmic: 'bg-gradient-to-br from-gray-800/50 to-gray-900/70',
    glass: 'bg-gray-800/30 backdrop-blur-lg',
    gradient: 'bg-gradient-to-br from-cyan-900/30 to-purple-900/30'
  };
  
  // Hover effect classes
  const hoverClasses = {
    none: '',
    lift: 'hover:transform hover:scale-[1.02] hover:-translate-y-1',
    glow: 'hover:shadow-lg hover:shadow-cyan-500/20',
    border: 'hover:border-cyan-500/30',
    scale: 'hover:transform hover:scale-[1.02]',
    cosmic: 'hover:bg-gradient-to-br hover:from-gray-800/70 hover:to-gray-900/90 hover:transform hover:scale-[1.01]'
  };
  
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    default: 'p-6 md:p-8',
    small: 'p-4',
    large: 'p-8 md:p-10'
  };
  
  // Shadow classes
  const shadowClasses = {
    none: '',
    default: 'shadow-lg',
    soft: 'shadow-md',
    cosmic: 'shadow-xl shadow-cyan-900/10',
    glow: 'shadow-lg shadow-cyan-500/10'
  };
  
  // Border classes
  const borderClass = border ? 'border border-gray-700/50' : '';
  
  const combinedClassName = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.default}
    ${hoverClasses[hover] || hoverClasses.none}
    ${paddingClasses[padding] || paddingClasses.default}
    ${shadowClasses[shadow] || shadowClasses.default}
    ${borderClass}
    ${className}
  `.trim();
  
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
Card.Header = ({ children, className = '', ...props }) => {
  const combinedClassName = `mb-6 ${className}`.trim();
  
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

// Card Title Component
Card.Title = ({ children, className = '', ...props }) => {
  const combinedClassName = `text-xl md:text-2xl font-bold text-white mb-2 ${className}`.trim();
  
  return (
    <h3 className={combinedClassName} {...props}>
      {children}
    </h3>
  );
};

// Card Subtitle Component
Card.Subtitle = ({ children, className = '', ...props }) => {
  const combinedClassName = `text-gray-300 ${className}`.trim();
  
  return (
    <p className={combinedClassName} {...props}>
      {children}
    </p>
  );
};

// Card Body Component
Card.Body = ({ children, className = '', ...props }) => {
  const combinedClassName = `text-gray-300 ${className}`.trim();
  
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
Card.Footer = ({ children, className = '', ...props }) => {
  const combinedClassName = `mt-6 pt-4 border-t border-gray-700/30 ${className}`.trim();
  
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

// Card with cosmic stars background
Card.Cosmic = ({ children, className = '', starCount = 30, ...props }) => {
  // Generate random stars for background
  const stars = Array.from({ length: starCount }).map((_, i) => {
    const size = Math.random() * 1.5 + 0.5;
    return (
      <div 
        key={i}
        className="absolute rounded-full bg-white animate-starTwinkle"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.8 + 0.2,
          animationDuration: `${Math.random() * 5 + 2}s`,
          animationDelay: `${Math.random() * 2}s`
        }}
      />
    );
  });
  
  return (
    <Card 
      variant="gradient" 
      className={`relative overflow-hidden ${className}`} 
      {...props}
    >
      <div className="absolute inset-0 z-0">
        {stars}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
      </div>
      <div className="relative z-10">{children}</div>
    </Card>
  );
};

export default Card;