import type { Chain } from "../types";
export default {
  "chain": "Boba BNB Mainnet",
  "chainId": 97288,
  "explorers": [
    {
      "name": "Boba BNB block explorer",
      "url": "https://blockexplorer.bnb.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://boba.network",
  "name": "Boba BNB Mainnet Old",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "networkId": 97288,
  "rpc": [],
  "shortName": "BobaBnbOld",
  "slug": "boba-bnb-old",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;