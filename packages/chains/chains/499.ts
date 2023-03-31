import type { Chain } from "../src/types";
export default {
  "name": "Rupaya",
  "chain": "RUPX",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rupaya",
    "symbol": "RUPX",
    "decimals": 18
  },
  "infoURL": "https://www.rupx.io",
  "shortName": "rupx",
  "chainId": 499,
  "networkId": 499,
  "slip44": 499,
  "testnet": false,
  "slug": "rupaya"
} as const satisfies Chain;