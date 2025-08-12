/** biome-ignore-all lint/correctness/useExhaustiveDependencies: we only want to run effect once */
"use client";
import { useEffect, useRef } from "react";

export function useEffectOnce(effect: () => void) {
  const hasCalledEffect = useRef(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (hasCalledEffect.current) return;
    hasCalledEffect.current = true;
    effect();
  }, []);
}
