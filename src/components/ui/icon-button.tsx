import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import * as Icons from 'lucide-react';

/**
 * Icon Button Component
 * Provides a flexible icon button with automatic sizing and styling
 * Supports all Lucide React icons
 */

const iconButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-maycole-green text-white hover:bg-maycole-green/90 shadow-md hover:shadow-lg",
        primary: "bg-maycole-blue text-white hover:bg-maycole-blue/90 shadow-md hover:shadow-lg",
        secondary: "bg-maycole-purple text-white hover:bg-maycole-purple/90 shadow-md hover:shadow-lg",
        outline: "border-2 border-maycole-green text-maycole-green hover:bg-maycole-green/10",
        ghost: "text-maycole-green hover:bg-maycole-green/10",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-amber-600 text-white hover:bg-amber-700",
        info: "bg-blue-600 text-white hover:bg-blue-700",
      },
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon?: React.ReactNode;
  iconName?: keyof typeof Icons;
  asChild?: boolean;
  tooltip?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      iconName,
      asChild = false,
      tooltip,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    
    // Get icon from lucide-react if iconName is provided
    let iconElement = icon;
    if (iconName && !icon) {
      const IconComponent = Icons[iconName] as React.ComponentType<{ size: number }>;
      const sizeMap = {
        xs: 14,
        sm: 16,
        default: 20,
        lg: 24,
        xl: 28,
      };
      const iconSize = sizeMap[size as keyof typeof sizeMap] || 20;
      iconElement = <IconComponent size={iconSize} />;
    }

    const button = (
      <Comp
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        title={tooltip}
        {...props}
      >
        {iconElement}
      </Comp>
    );

    if (tooltip) {
      return (
        <div className="relative group">
          {button}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {tooltip}
          </div>
        </div>
      );
    }

    return button;
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
