import type { Chain } from "../src/types";
export default {
  "chainId": 1297,
  "chain": "Bobabase Testnet",
  "name": "Bobabase Testnet",
  "rpc": [
    "https://bobabase-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobabase.boba.network",
    "wss://wss.bobabase.boba.network",
    "https://replica.bobabase.boba.network",
    "wss://replica-wss.bobabase.boba.network"
  ],
  "slug": "bobabase-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "Bobabase",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bobabase block explorer",
      "url": "https://blockexplorer.bobabase.boba.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;