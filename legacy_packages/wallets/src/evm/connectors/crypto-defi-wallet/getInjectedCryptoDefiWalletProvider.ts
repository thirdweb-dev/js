import { Ethereum } from "../injected/types";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";

declare global {
  interface Window {
    deficonnectProvider?: Ethereum;
  }
}

/**
 * @internal
 */
export function getInjectedCryptoDefiWalletProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  if (assertWindowEthereum(globalThis.window)) {
    if (globalThis.window.ethereum && window.deficonnectProvider) {
      return window.deficonnectProvider;
    }
  }
}
