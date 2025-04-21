// src/components/ui/Button.jsx
import React from 'react';

const variants = {
  primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20',
  secondary: 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/80',
  outline: 'bg-transparent border border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400',
  cosmic: 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-lg shadow-purple-500/20',
  ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-gray-800/50'
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg'
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  withHoverEffect = true,
  rounded = 'lg',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300';
  
  const hoverEffect = withHoverEffect ? 'hover:-translate-y-1' : '';
  
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const roundedClass = `rounded-${rounded}`;
  const disabledClasses = disabled || loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90';
  
  const combinedClassName = `
    ${baseClasses}
    ${variantClasses}
    ${sizeClasses}
    ${roundedClass}
    ${disabledClasses}
    ${hoverEffect}
    ${className}
  `.trim();
  
  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;