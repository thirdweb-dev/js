import type { Ethereum } from "../connectors/injected/types";

export function assertWindowEthereum(
  w: Window,
): w is Window & { ethereum: Ethereum } {
  return typeof w !== "undefined" && "ethereum" in w;
}
