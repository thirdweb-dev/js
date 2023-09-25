import type { Chain } from "../src/types";
export default {
  "chainId": 1022,
  "chain": "Sakura",
  "name": "Sakura",
  "rpc": [],
  "slug": "sakura",
  "faucets": [],
  "nativeCurrency": {
    "name": "Sakura",
    "symbol": "SKU",
    "decimals": 18
  },
  "infoURL": "https://clover.finance/sakura",
  "shortName": "sku",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;