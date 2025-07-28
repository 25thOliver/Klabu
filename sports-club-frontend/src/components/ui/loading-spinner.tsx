import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  default: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'default', 
  className,
  text 
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={cn('relative', sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>
      {text && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  text,
  children 
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  );
};