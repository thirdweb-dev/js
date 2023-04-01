import type { Chain } from "../src/types";
export default {
  "name": "QuarkChain Devnet Root",
  "chain": "QuarkChain",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-r",
  "chainId": 110000,
  "networkId": 110000,
  "testnet": false,
  "slug": "quarkchain-devnet-root"
} as const satisfies Chain;