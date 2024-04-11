import { useEffect, useState } from "react";

/**
 * @internal
 */
export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    let ignore = false;
    const id = setTimeout(() => {
      if (ignore) {
        return;
      }
      setDebouncedValue(value);
    }, delay);

    return () => {
      ignore = true;
      clearTimeout(id);
    };
  }, [value, delay]);

  return debouncedValue;
}
