import type { Chain } from "../src/types";
export default {
  "chain": "Bobabeam",
  "chainId": 1294,
  "explorers": [
    {
      "name": "Bobabeam block explorer",
      "url": "https://blockexplorer.bobabeam.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://boba.network",
  "name": "Bobabeam",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "networkId": 1294,
  "rpc": [
    "https://1294.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobabeam.boba.network",
    "wss://wss.bobabeam.boba.network",
    "https://replica.bobabeam.boba.network",
    "wss://replica-wss.bobabeam.boba.network"
  ],
  "shortName": "Bobabeam",
  "slug": "bobabeam",
  "testnet": false
} as const satisfies Chain;