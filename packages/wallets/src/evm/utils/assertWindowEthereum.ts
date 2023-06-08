import type { Ethereum } from "../connectors/injected/types";

export function assertWindowEthereum(
  w: Window,
): w is Window & { ethereum: Ethereum } & { bitkeep: any } {
  return typeof w !== "undefined" && "ethereum" in w;
}
