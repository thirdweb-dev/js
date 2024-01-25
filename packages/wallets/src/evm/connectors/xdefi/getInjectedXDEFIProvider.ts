import { Ethereum } from "../injected/types";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";

declare global {
  interface Window {
    xdefi?: Ethereum;
  }
}

/**
 * @internal
 */
export function getInjectedXDEFIProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  if (assertWindowEthereum(globalThis.window)) {
    if (globalThis.window.ethereum && window.xdefi) {
      return window.xdefi;
    }
  }
}
