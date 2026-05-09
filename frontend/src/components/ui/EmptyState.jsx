import React from 'react';
import PropTypes from 'prop-types';

export const EmptyState = ({ icon, title, description, action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-surface border border-surface-2 rounded-xl ${className}`}>
      {icon && (
        <div className="mb-4 text-text-muted flex items-center justify-center w-16 h-16 bg-surface-2 rounded-full">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
      {description && (
        <p className="text-text-muted max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};
