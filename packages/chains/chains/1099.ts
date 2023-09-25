import type { Chain } from "../src/types";
export default {
  "chainId": 1099,
  "chain": "MOAC",
  "name": "MOAC mainnet",
  "rpc": [],
  "slug": "moac",
  "faucets": [],
  "nativeCurrency": {
    "name": "MOAC",
    "symbol": "mc",
    "decimals": 18
  },
  "infoURL": "https://moac.io",
  "shortName": "moac",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "moac explorer",
      "url": "https://explorer.moac.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;