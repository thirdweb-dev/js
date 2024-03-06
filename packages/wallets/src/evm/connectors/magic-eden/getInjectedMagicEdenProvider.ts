import { Ethereum } from "../injected/types";

declare global {
  interface Window {
    magicEden?: {
      ethereum?: Ethereum;
    };
  }
}

/**
 * @internal
 */
export function getInjectedMagicEdenProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  if (
    globalThis.window &&
    globalThis.window.magicEden &&
    globalThis.window.magicEden.ethereum
  ) {
    return globalThis.window.magicEden.ethereum;
  }
}