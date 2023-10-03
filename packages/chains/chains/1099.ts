import type { Chain } from "../src/types";
export default {
  "chain": "MOAC",
  "chainId": 1099,
  "explorers": [
    {
      "name": "moac explorer",
      "url": "https://explorer.moac.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://moac.io",
  "name": "MOAC mainnet",
  "nativeCurrency": {
    "name": "MOAC",
    "symbol": "mc",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "moac",
  "slug": "moac",
  "testnet": false
} as const satisfies Chain;