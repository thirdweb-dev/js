import type { Chain } from "../src/types";
export default {
  "name": "Karura Network",
  "chain": "KAR",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Karura Token",
    "symbol": "KAR",
    "decimals": 18
  },
  "infoURL": "https://karura.network",
  "shortName": "kar",
  "chainId": 686,
  "networkId": 686,
  "slip44": 686,
  "testnet": false,
  "slug": "karura-network"
} as const satisfies Chain;