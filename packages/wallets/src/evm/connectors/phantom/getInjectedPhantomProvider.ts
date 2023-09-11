import { Ethereum } from "../injected/types";

declare global {
  interface Window {
    phantom?: {
      ethereum?: Ethereum;
    };
  }
}

export function getInjectedPhantomProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  const provider = window.phantom?.ethereum;

  if (provider?.isPhantom) {
    return provider;
  }
}
