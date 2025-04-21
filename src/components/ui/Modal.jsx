// src/components/ui/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  variant = 'default',
  className = '',
  overlayClassName = '',
}) => {
  const modalRef = useRef(null);
  
  // Close on escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Close when clicking outside the modal
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full m-4'
  };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-gray-800/90 backdrop-blur-md border border-gray-700/50',
    dark: 'bg-gray-900/95 backdrop-blur-lg border border-gray-800/50',
    cosmic: 'bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-md border border-gray-700/50',
    glass: 'bg-gray-800/30 backdrop-blur-xl border border-gray-700/30'
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-lg transition-opacity ${overlayClassName}`}
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`
          w-full rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 transform 
          ${sizeClasses[size] || sizeClasses.md}
          ${variantClasses[variant] || variantClasses.default}
          ${className}
        `}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 id="modal-title" className="text-xl font-bold text-white">
              {title}
            </h2>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={!title ? 'p-6' : 'px-6 pb-6'}>
          {children}
        </div>
        
        {/* If no title is provided but we still want a close button */}
        {!title && showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {/* Optional: Add star particles in the backdrop for cosmic effect */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 2 + 0.5;
          return (
            <div 
              key={`modal-star-${i}`}
              className="absolute rounded-full bg-white animate-starTwinkle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.1,
                animationDuration: `${Math.random() * 5 + 2}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Modal Header Component
Modal.Header = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 pt-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Modal Body Component
Modal.Body = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Modal Footer Component
Modal.Footer = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 mt-2 border-t border-gray-700/30 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Modal;