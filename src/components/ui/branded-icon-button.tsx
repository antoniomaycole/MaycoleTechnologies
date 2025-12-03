import React from 'react';
import { cn } from './utils';

interface BrandedIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  showBrackets?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
}

/**
 * MaycoleTechnologies Branded Icon Button
 * Features angle bracket design: < MaycoleTechnologies >
 * Scalable across all platforms (Desktop, iOS, Android)
 */
export const BrandedIconButton = React.forwardRef<HTMLButtonElement, BrandedIconButtonProps>(
  (
    {
      text = 'MaycoleTechnologies',
      showBrackets = true,
      size = 'md',
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
      default: 'bg-maycole-green text-white hover:bg-maycole-green/90 shadow-md hover:shadow-lg',
      primary: 'bg-maycole-blue text-white hover:bg-maycole-blue/90 shadow-md hover:shadow-lg',
      secondary: 'bg-maycole-purple text-white hover:bg-maycole-purple/90 shadow-md hover:shadow-lg',
      outline: 'border-2 border-maycole-green text-maycole-green hover:bg-maycole-green/10',
      ghost: 'text-maycole-green hover:bg-maycole-green/10',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] tracking-wide',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {showBrackets && <span className="font-bold">&lt;</span>}
        <span className="maycole-gradient-text font-bold">{text}</span>
        {showBrackets && <span className="font-bold">&gt;</span>}
      </button>
    );
  }
);

BrandedIconButton.displayName = 'BrandedIconButton';

export default BrandedIconButton;
