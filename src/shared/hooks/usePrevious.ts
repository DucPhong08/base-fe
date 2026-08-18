import { useRef, useEffect } from 'react';

/**
 * Stores and returns the previous value of a state or prop across renders.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
