import type { Chain } from "../src/types";
export default {
  "chain": "Bobabase Testnet",
  "chainId": 1297,
  "explorers": [
    {
      "name": "Bobabase block explorer",
      "url": "https://blockexplorer.bobabase.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://boba.network",
  "name": "Bobabase Testnet",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bobabase-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobabase.boba.network",
    "wss://wss.bobabase.boba.network",
    "https://replica.bobabase.boba.network",
    "wss://replica-wss.bobabase.boba.network"
  ],
  "shortName": "Bobabase",
  "slug": "bobabase-testnet",
  "testnet": true
} as const satisfies Chain;