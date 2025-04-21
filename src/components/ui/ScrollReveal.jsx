// src/components/ui/ScrollReveal.jsx
import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = '0px', 
  className = '', 
  childrenReveal = false
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const currentRef = ref.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);
  
  const combinedClassName = `
    reveal 
    ${childrenReveal ? 'reveal-children' : ''} 
    ${isVisible ? 'active' : ''} 
    ${className}
  `.trim();
  
  return (
    <div ref={ref} className={combinedClassName}>
      {children}
    </div>
  );
};

export default ScrollReveal;