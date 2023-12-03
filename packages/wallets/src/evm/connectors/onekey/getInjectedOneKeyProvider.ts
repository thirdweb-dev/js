import { Ethereum } from "../injected/types";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";

declare global {
  interface Window {
    $onekey?: {
      ethereum: Ethereum;
    };
  }
}

export function getInjectedOneKeyProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  if (assertWindowEthereum(globalThis.window)) {
    if (globalThis.window.$onekey && globalThis.window.$onekey.ethereum) {
      return globalThis.window.$onekey.ethereum;
    }
  }
}
