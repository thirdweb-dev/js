import type { Ethereum } from "../connectors/injected/types";

export function assertWindowEthereum(
  w: Window,
): w is Window & { ethereum: Ethereum } {
  return typeof window !== "undefined" && "ethereum" in window;
}
