import type { Chain } from "../src/types";
export default {
  "chainId": 301,
  "chain": "Bobaopera",
  "name": "Bobaopera",
  "rpc": [
    "https://bobaopera.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobaopera.boba.network",
    "wss://wss.bobaopera.boba.network",
    "https://replica.bobaopera.boba.network",
    "wss://replica-wss.bobaopera.boba.network"
  ],
  "slug": "bobaopera",
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "Bobaopera",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bobaopera block explorer",
      "url": "https://blockexplorer.bobaopera.boba.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;