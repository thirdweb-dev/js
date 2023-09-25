import type { Chain } from "../src/types";
export default {
  "chainId": 1294,
  "chain": "Bobabeam",
  "name": "Bobabeam",
  "rpc": [
    "https://bobabeam.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobabeam.boba.network",
    "wss://wss.bobabeam.boba.network",
    "https://replica.bobabeam.boba.network",
    "wss://replica-wss.bobabeam.boba.network"
  ],
  "slug": "bobabeam",
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "Bobabeam",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bobabeam block explorer",
      "url": "https://blockexplorer.bobabeam.boba.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;