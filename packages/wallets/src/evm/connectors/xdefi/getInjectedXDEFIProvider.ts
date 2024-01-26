import { Ethereum } from "../injected/types";

declare global {
  interface Window {
    xfi?: {
      ethereum?: Ethereum;
    };
  }
}

/**
 * @internal
 */
export function getInjectedXDEFIProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  if (
    globalThis.window &&
    globalThis.window.xfi &&
    globalThis.window.xfi.ethereum
  ) {
    return globalThis.window.xfi.ethereum;
  }
}
