"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * todo: this hook is copied from the SDK, so might as well expose it from the SDK
 * and use it here?
 */
export function useClipboard(text: string, delay = 1500) {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setHasCopied(true);
  }, [text]);

  // legitimate usecase
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    let timeoutId: number | null = null;

    if (hasCopied) {
      timeoutId = window.setTimeout(() => {
        setHasCopied(false);
      }, delay);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [hasCopied, delay]);

  return { hasCopied, onCopy };
}
