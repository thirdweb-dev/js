import { Ethereum } from "../injected/types";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";

export function getInjectedMetamaskProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  function getReady(ethereum?: Ethereum): Ethereum | undefined {
    const isMetaMask = !!ethereum?.isMetaMask;

    if (!isMetaMask) {
      return;
    }
    // Brave tries to make itself look like MetaMask
    // Could also try RPC `web3_clientVersion` if following is unreliable
    if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) {
      return;
    }

    if (ethereum.isRainbow) {
      return;
    }

    if (ethereum.isPhantom) {
      return;
    }

    if (ethereum.isAvalanche) {
      return;
    }

    if (ethereum.isBitKeep) {
      return;
    }

    if (ethereum.isMathWallet) {
      return;
    }

    if (ethereum.isZerion) {
      return;
    }

    if (ethereum.isKuCoinWallet) {
      return;
    }

    if (ethereum.isPortal) {
      return;
    }

    if (ethereum.isTokenPocket) {
      return;
    }

    if (ethereum.isTokenary) {
      return;
    }

    return ethereum;
  }

  if (assertWindowEthereum(globalThis.window)) {
    if (globalThis.window.ethereum?.providers) {
      return globalThis.window.ethereum.providers.find(getReady);
    }

    return getReady(globalThis.window.ethereum);
  }
}
