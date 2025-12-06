/**
 * Utility function for conditional className
 */
function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Skeleton loader component for loading states
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-800', className)}
      {...props}
    />
  );
}

/**
 * Skeleton variants
 */

export function TextSkeleton({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-800">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <TextSkeleton lines={3} className="mb-4" />
      <Skeleton className="h-10 w-1/4" />
    </div>
  );
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full space-y-4">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={`${rowIdx}-${colIdx}`} className="h-8" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Loading state wrapper component
 */
export function LoadingState({
  isLoading,
  children,
  skeleton = <Skeleton className="h-96" />,
  error,
  errorComponent,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  error?: Error | null;
  errorComponent?: React.ReactNode;
}) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
        <h3 className="font-semibold text-red-900 dark:text-red-100">Error Loading Content</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
          {error.message || 'Something went wrong. Please try again.'}
        </p>
        {errorComponent}
      </div>
    );
  }

  if (isLoading) {
    return skeleton;
  }

  return children;
}
