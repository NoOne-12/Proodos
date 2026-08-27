import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidthClass} rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200`}>
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">{title}</h3>
            {description && (
              <p className="text-xs text-[var(--text-muted)] mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-main)] transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};
