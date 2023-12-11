import { Ethereum } from "../injected/types";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";

declare global {
  interface Window {
    okxwallet?: Ethereum;
  }
}

/**
 * @internal
 */
export function getInjectedOKXProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  if (assertWindowEthereum(globalThis.window)) {
    if (globalThis.window.ethereum && window.okxwallet) {
      return window.okxwallet;
    }
  }
}
