import { Ethereum } from "../injected/types";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";

declare global {
  interface Window {
    coin98?: Ethereum;
  }
}

export function getInjectedCoin98Provider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  if (assertWindowEthereum(globalThis.window)) {
    if (globalThis.window.ethereum && window.coin98) {
      return window.ethereum;
    }
  }
}
