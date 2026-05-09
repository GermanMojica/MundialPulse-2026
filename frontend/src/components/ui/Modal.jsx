import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

export const Modal = ({ isOpen, onClose, children, title, className = '' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-lg transform rounded-xl bg-surface p-6 text-left shadow-xl transition-all border border-surface-2 ${className}`}>
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text">{title}</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text focus:outline-none transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};
