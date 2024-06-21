import { useEffect, useState } from "react";
import { isBrowser } from "utils/isBrowser";

export function useLocalStorage<TType>(
  key: string,
  initialValue: TType,
  serverSideFallback: TType = initialValue,
) {
  const [value, _setValue] = useState<TType>(serverSideFallback);

  // FIXME: ideally we do not need localstorage like this, alernatively we move this into use-query and use-mutation to invalidate etc
  // eslint-disable-next-line no-restricted-syntax
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
