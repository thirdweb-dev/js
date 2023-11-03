import type { Chain } from "../types";
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
  "infoURL": "https://moac.io",
  "name": "MOAC mainnet",
  "nativeCurrency": {
    "name": "MOAC",
    "symbol": "mc",
    "decimals": 18
  },
  "networkId": 1099,
  "rpc": [],
  "shortName": "moac",
  "slip44": 314,
  "slug": "moac",
  "testnet": false
} as const satisfies Chain;