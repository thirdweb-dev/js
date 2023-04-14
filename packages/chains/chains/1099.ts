import type { Chain } from "../src/types";
export default {
  "name": "MOAC mainnet",
  "chain": "MOAC",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "MOAC",
    "symbol": "mc",
    "decimals": 18
  },
  "infoURL": "https://moac.io",
  "shortName": "moac",
  "chainId": 1099,
  "networkId": 1099,
  "slip44": 314,
  "explorers": [
    {
      "name": "moac explorer",
      "url": "https://explorer.moac.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "moac"
} as const satisfies Chain;