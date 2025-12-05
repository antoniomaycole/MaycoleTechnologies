import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect if component is mounted
 * Prevents state updates on unmounted components
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}
