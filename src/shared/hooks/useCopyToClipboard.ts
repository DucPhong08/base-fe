import { useState, useCallback } from 'react';

/**
 * Copies text to clipboard and manages temporary success status.
 */
export function useCopyToClipboard(
  resetInterval = 2000,
): [boolean, (text: string) => Promise<boolean>] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not supported');
        return false;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetInterval);
        return true;
      } catch (error) {
        console.error('Failed to copy text:', error);
        setCopied(false);
        return false;
      }
    },
    [resetInterval],
  );

  return [copied, copy];
}
