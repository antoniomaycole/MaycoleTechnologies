import { motion } from 'motion/react';
import { forwardRef } from 'react';
import { CleanIcon } from '../MaycoleTracker-Website-Logo-Transfer';
import { cn } from './ui/utils';

interface MaycoleTrackerButtonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'icon-only' | 'with-text' | 'with-label';
  animated?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  text?: string;
  label?: string;
}

// Complete MaycoleTracker Button Component with SwiftUI Icon
export const MaycoleTrackerButton = forwardRef<HTMLButtonElement, MaycoleTrackerButtonProps>(
  (
    {
      size = 'md',
      variant = 'default',
      animated = false,
      className,
      onClick,
      disabled = false,
      children,
      text,
      label,
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm gap-2',
      md: 'px-4 py-3 text-base gap-3',
      lg: 'px-6 py-4 text-lg gap-4',
      xl: 'px-8 py-5 text-xl gap-5',
    };

    const iconSizes = {
      sm: 24,
      md: 32,
      lg: 48,
      xl: 64,
    };

    const handleClick = () => {
      if (!disabled && onClick) {
        onClick();
      }
    };

    // Icon only variant
    if (variant === 'icon-only') {
      return (
        <motion.button
          ref={ref}
          onClick={handleClick}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          className={cn(
            'inline-flex items-center justify-center p-2 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          title="MaycoleTracker™"
        >
          <CleanIcon size={iconSizes[size]} animated={animated} interactive={false} />
        </motion.button>
      );
    }

    // Button with icon and content
    return (
      <motion.button
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={cn(
          // Base button styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // MaycoleTechnologies™ brand styling
          'bg-gradient-to-r from-maycole-green to-maycole-gold text-white',
          'hover:shadow-lg hover:from-maycole-green hover:to-yellow-500',
          'border border-maycole-green/20',

          // Size-specific styles
          sizeClasses[size],

          className
        )}
      >
        {/* MaycoleTracker Icon */}
        <CleanIcon size={iconSizes[size]} animated={animated} interactive={false} />

        {/* Content */}
        {variant === 'with-text' && (
          <span className="font-medium">{text || children || 'MaycoleTracker™'}</span>
        )}

        {variant === 'with-label' && (
          <div className="flex flex-col items-start">
            <span className="font-bold text-sm leading-tight">MaycoleTracker™</span>
            {label && <span className="text-xs opacity-90 leading-tight">{label}</span>}
          </div>
        )}

        {variant === 'default' && (children || text) && (
          <span className="font-medium">{children || text}</span>
        )}
      </motion.button>
    );
  }
);

MaycoleTrackerButton.displayName = 'MaycoleTrackerButton';

// Convenience components for common use cases
export const MaycoleTrackerIconButton = (props: Omit<MaycoleTrackerButtonProps, 'variant'>) => (
  <MaycoleTrackerButton {...props} variant="icon-only" />
);

export const MaycoleTrackerTextButton = (props: Omit<MaycoleTrackerButtonProps, 'variant'>) => (
  <MaycoleTrackerButton {...props} variant="with-text" />
);

export const MaycoleTrackerLabelButton = (props: Omit<MaycoleTrackerButtonProps, 'variant'>) => (
  <MaycoleTrackerButton {...props} variant="with-label" />
);

export default MaycoleTrackerButton;
