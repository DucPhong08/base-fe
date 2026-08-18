import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Persists state in localStorage and keeps state in sync across browser tabs.
 * Optimized with stable references to prevent unnecessary re-render loops.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const initialValueRef = useRef(initialValue);

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValueRef.current;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValueRef.current;
    } catch {
      return initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const newValue = value instanceof Function ? value(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(newValue));
          window.dispatchEvent(new Event('local-storage'));
          return newValue;
        });
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
}
