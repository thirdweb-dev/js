import { Ethereum } from "../injected/types";

/**
 * @internal
 */
export function getInjectedBinanceProvider(): Ethereum | undefined {
  if (typeof window === "undefined") {
    return;
  }

  // Browser extensions are not yet released.
  // will update once it's out
  return;
}
