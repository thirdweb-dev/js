import type { Chain } from "../types";
export default {
  "chain": "Clover",
  "chainId": 1023,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://clover.finance",
  "name": "Clover Testnet",
  "nativeCurrency": {
    "name": "Clover",
    "symbol": "CLV",
    "decimals": 18
  },
  "networkId": 1023,
  "rpc": [],
  "shortName": "tclv",
  "slug": "clover-testnet",
  "testnet": true
} as const satisfies Chain;