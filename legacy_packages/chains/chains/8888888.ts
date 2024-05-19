import type { Chain } from "../src/types";
export default {
  "chain": "Quarix",
  "chainId": 8888888,
  "explorers": [],
  "faucets": [],
  "name": "Quarix",
  "nativeCurrency": {
    "name": "QARE",
    "symbol": "QARE",
    "decimals": 18
  },
  "networkId": 8888888,
  "rpc": [],
  "shortName": "quarix",
  "slug": "quarix",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;