import React, { forwardRef } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  variant = 'ghost',
  size = 'md',
  label,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b12] disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    xs: 'w-6 h-6 p-1 text-xs',
    sm: 'w-7 h-7 p-1.5 text-xs',
    md: 'w-8 h-8 p-2 text-sm',
    lg: 'w-10 h-10 p-2.5 text-base',
  };

  const variantStyles = {
    ghost: 'bg-transparent hover:bg-[#141e30] text-slate-300 hover:text-white',
    secondary: 'bg-[#101827] hover:bg-[#182338] text-slate-300 hover:text-white border border-[#202e45]',
    outline: 'bg-transparent hover:bg-[#141e30] text-slate-300 border border-[#202e45] hover:border-slate-400',
    danger: 'bg-transparent hover:bg-red-950/40 text-red-400 border border-transparent hover:border-red-500/40',
  };

  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';
