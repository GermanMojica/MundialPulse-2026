import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from './Spinner';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-bg hover:opacity-90 focus:ring-primary',
    secondary: 'bg-surface-2 text-text hover:bg-surface focus:ring-surface-2 border border-surface',
    ghost: 'bg-transparent text-text hover:bg-surface-2 focus:ring-surface-2',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className="w-4 h-4 mr-2" size="sm" />}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
