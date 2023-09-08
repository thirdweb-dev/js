import { Ethereum } from "../injected/types";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";

export function getInjectedPhantomProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  function getReady(ethereum?: Ethereum): Ethereum | undefined {
    const isPhantom = !!ethereum?.isPhantom;

    if (!isPhantom) {
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
