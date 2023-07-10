import type { Ethereum } from "../connectors/injected/types";

interface WindowWithEthereum extends Window {
  ethereum: Ethereum;
}

export function assertWindowEthereum(w: Window): w is WindowWithEthereum {
  return typeof w !== "undefined" && !!w && "ethereum" in w;
}
