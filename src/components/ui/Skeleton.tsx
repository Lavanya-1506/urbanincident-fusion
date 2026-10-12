import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  width,
  height,
}) => {
  const variantStyles = {
    text: 'h-3.5 rounded',
    rect: 'rounded-md',
    circle: 'rounded-full',
  };

  return (
    <div
      style={{ width, height }}
      className={`animate-pulse bg-[#141e30] border border-[#1e2a3f] ${variantStyles[variant]} ${className}`}
    />
  );
};
