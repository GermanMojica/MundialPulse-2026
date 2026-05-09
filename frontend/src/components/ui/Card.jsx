import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseStyles = 'bg-surface rounded-[12px] border border-surface-2 p-4 sm:p-6';
  const hoverStyles = hover ? 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
};
