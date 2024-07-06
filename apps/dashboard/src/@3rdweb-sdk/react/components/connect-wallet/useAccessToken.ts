import { useSyncExternalStore } from "react";

// historical reasons
const GLOBAL_AUTH_TOKEN_KEY = "TW_AUTH_TOKEN";

let currentAccessToken: string | null = null;
let listeners: Array<() => void> = [];

const accessTokenStore = {
  set: (value: string | null) => {
    // also set it on window (because of legacy things reading from there)
    // biome-ignore lint/suspicious/noExplicitAny: needed
    (window as any)[GLOBAL_AUTH_TOKEN_KEY] = value;
    currentAccessToken = value;
    for (const listener of listeners) {
      listener();
    }
  },
  getSnapshot: () => currentAccessToken,
  subscribe: (listener: () => void) => {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

export function setAccessToken(value: string) {
  accessTokenStore.set(value);
}
export function clearAccessToken() {
  accessTokenStore.set(null);
}

export function useAccessToken() {
  return useSyncExternalStore(
    accessTokenStore.subscribe,
    accessTokenStore.getSnapshot,
    // TODO: we should actually be able to grab this server side once we move auth to the next server
    () => null,
  );
}
