import { useCallback, useEffect, useState } from "react";

/**
 * @internal
 */
export function useClipboard(text: string) {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setHasCopied(true);
  }, [text]);

  useEffect(() => {
    let timeoutId: number | null = null;

    if (hasCopied) {
      timeoutId = window.setTimeout(() => {
        setHasCopied(false);
      }, 1500);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [hasCopied]);

  return { onCopy, hasCopied };
}
