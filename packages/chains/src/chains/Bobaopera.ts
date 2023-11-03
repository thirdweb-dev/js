import type { Chain } from "../types";
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
  "infoURL": "https://boba.network",
  "name": "Bobaopera",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "networkId": 301,
  "rpc": [
    "https://bobaopera.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://301.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobaopera.boba.network",
    "wss://wss.bobaopera.boba.network",
    "https://replica.bobaopera.boba.network",
    "wss://replica-wss.bobaopera.boba.network"
  ],
  "shortName": "Bobaopera",
  "slug": "bobaopera",
  "testnet": false
} as const satisfies Chain;