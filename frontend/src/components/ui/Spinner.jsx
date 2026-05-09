import React from 'react';
import PropTypes from 'prop-types';

export const Spinner = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`relative inline-block ${sizes[size]} ${className}`}>
      <div className="absolute w-full h-full rounded-full border-2 border-surface-2"></div>
      <div className="absolute w-full h-full rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
    </div>
  );
};

Spinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};
