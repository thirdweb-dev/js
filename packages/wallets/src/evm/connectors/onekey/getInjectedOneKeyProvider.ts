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
    if (
      globalThis.window.ethereum &&
      window.$onekey &&
      window.$onekey.ethereum
    ) {
      return window.$onekey.ethereum;
    }
  }
}
