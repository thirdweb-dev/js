import { Ethereum } from "../injected/types";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";

declare global {
  interface Window {
    rabby?: Ethereum;
  }
}

/**
 * @internal
 */
export function getInjectedRabbyProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  if (assertWindowEthereum(globalThis.window)) {
    if (globalThis.window.ethereum && window.rabby) {
      return window.rabby;
    }
  }
}
