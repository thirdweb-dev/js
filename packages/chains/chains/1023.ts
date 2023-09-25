import type { Chain } from "../src/types";
export default {
  "chainId": 1023,
  "chain": "Clover",
  "name": "Clover Testnet",
  "rpc": [],
  "slug": "clover-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Clover",
    "symbol": "CLV",
    "decimals": 18
  },
  "infoURL": "https://clover.finance",
  "shortName": "tclv",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;