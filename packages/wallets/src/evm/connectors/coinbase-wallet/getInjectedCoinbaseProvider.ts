import { Ethereum } from "../injected/types";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";

export function getInjectedCoinbaseProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  function getReady(ethereum?: Ethereum): Ethereum | undefined {
    const isCoinbaseWallet = !!ethereum?.isCoinbaseWallet;

    if (isCoinbaseWallet) {
      return ethereum;
    }

    if (ethereum && "overrideIsMetaMask" in ethereum) {
      if ("providerMap" in ethereum) {
        if (ethereum.providerMap instanceof Map) {
          if (ethereum.providerMap.has("CoinbaseWallet")) {
            return ethereum;
          }
        }
      }
    }
  }

  if (assertWindowEthereum(globalThis.window)) {
    if (globalThis.window.ethereum?.providers) {
      return globalThis.window.ethereum.providers.find(getReady);
    }

    return getReady(globalThis.window.ethereum);
  }
}
