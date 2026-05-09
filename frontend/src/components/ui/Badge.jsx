import React from 'react';
import PropTypes from 'prop-types';

export const Badge = ({ children, variant = 'green', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variants = {
    green: 'bg-primary/20 text-primary',
    red: 'bg-red-500/20 text-red-400',
    yellow: 'bg-gold/20 text-gold',
    blue: 'bg-blue-500/20 text-blue-400',
    gray: 'bg-surface-2 text-text-muted',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['green', 'red', 'yellow', 'blue', 'gray']),
  size: PropTypes.oneOf(['sm', 'md']),
  className: PropTypes.string,
};
