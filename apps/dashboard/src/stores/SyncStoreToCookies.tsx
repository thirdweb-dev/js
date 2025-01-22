import { type Store, useStore } from "@/lib/reactive";
import { useEffect } from "react";
import { getCookie, setCookie } from "../lib/cookie";

const loadedStoreKeys = new Set<string>();

export function SyncStoreToCookies<T>(props: {
  store: Store<T>;
  storageKey: string;
  onLoaded?: () => void;
}) {
  const storeValue = useStore(props.store);

  // load from storage
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (loadedStoreKeys.has(props.storageKey)) {
      return;
    }

    try {
      const storedValueStr = getCookie(props.storageKey);
      if (storedValueStr) {
        const parsedValue = JSON.parse(storedValueStr);
        props.store.setValue(parsedValue);
      }
    } catch {
      // ignore errors
    }

    loadedStoreKeys.add(props.storageKey);
    props.onLoaded?.();
  }, [props.store, props.storageKey, props.onLoaded]);

  // save changes to storage
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // don't sync changes to the store if it's not loaded yet
    if (!loadedStoreKeys.has(props.storageKey)) {
      return;
    }

    try {
      setCookie(
        props.storageKey,
        encodeURIComponent(JSON.stringify(storeValue)),
      );
    } catch {
      // ignore
    }
  }, [storeValue, props.storageKey]);

  return null;
}
