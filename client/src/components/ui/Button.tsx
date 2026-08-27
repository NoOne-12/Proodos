import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-[var(--primary)] text-white hover:opacity-90',
    secondary: 'bg-[var(--secondary)] text-white hover:opacity-90',
    outline: 'border border-[var(--border-color)] bg-transparent hover:bg-black/5 dark:hover:bg-white/5',
    ghost: 'hover:bg-black/5 dark:hover:bg-white/5',
    danger: 'bg-[var(--color-brand-brick)] text-white hover:opacity-90',
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 py-2',
    lg: 'h-14 px-8 text-lg',
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};
