import type { Chain } from "../src/types";
export default {
  "chain": "Bobaopera",
  "chainId": 301,
  "explorers": [
    {
      "name": "Bobaopera block explorer",
      "url": "https://blockexplorer.bobaopera.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://boba.network",
  "name": "Bobaopera",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bobaopera.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobaopera.boba.network",
    "wss://wss.bobaopera.boba.network",
    "https://replica.bobaopera.boba.network",
    "wss://replica-wss.bobaopera.boba.network"
  ],
  "shortName": "Bobaopera",
  "slug": "bobaopera",
  "testnet": false
} as const satisfies Chain;