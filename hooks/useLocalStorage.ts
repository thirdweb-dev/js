import { useEffect, useState } from "react";
import { isBrowser } from "utils/isBrowser";

export function useLocalStorage<TType>(
  key = "",
  initialValue: TType,
  serverSideFallback: TType = initialValue,
) {
  const [value, _setValue] = useState<TType>(serverSideFallback);

  useEffect(() => {
    const item = window.localStorage.getItem(key);

    _setValue(item ? JSON.parse(item) : initialValue);
  }, [key, initialValue]);

  const setValue = (value_: TType) => {
    _setValue(value_);
    if (isBrowser()) {
      window.localStorage.setItem(key, JSON.stringify(value_));
    }
  };

  return [value, setValue] as const;
}
