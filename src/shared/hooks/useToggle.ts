import { useState, useCallback } from 'react';

/**
 * Convenient boolean toggler for modals, drawers, sidebar states, and switches.
 */
export function useToggle(
  initialState = false,
): [boolean, () => void, (value: boolean) => void] {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  const setToggle = useCallback((value: boolean) => {
    setState(value);
  }, []);

  return [state, toggle, setToggle];
}
