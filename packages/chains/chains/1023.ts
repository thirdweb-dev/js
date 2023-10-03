import type { Chain } from "../src/types";
export default {
  "chain": "Clover",
  "chainId": 1023,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://clover.finance",
  "name": "Clover Testnet",
  "nativeCurrency": {
    "name": "Clover",
    "symbol": "CLV",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "tclv",
  "slug": "clover-testnet",
  "testnet": true
} as const satisfies Chain;