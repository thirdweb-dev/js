import type { Chain } from "../src/types";
export default {
  "name": "Sakura",
  "chain": "Sakura",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sakura",
    "symbol": "SKU",
    "decimals": 18
  },
  "infoURL": "https://clover.finance/sakura",
  "shortName": "sku",
  "chainId": 1022,
  "networkId": 1022,
  "testnet": false,
  "slug": "sakura"
} as const satisfies Chain;