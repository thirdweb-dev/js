import type { Chain } from "../src/types";
export default {
  "name": "Bobabase Testnet",
  "chain": "Bobabase Testnet",
  "rpc": [
    "https://bobabase-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobabase.boba.network",
    "wss://wss.bobabase.boba.network",
    "https://replica.bobabase.boba.network",
    "wss://replica-wss.bobabase.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "Bobabase",
  "chainId": 1297,
  "networkId": 1297,
  "explorers": [
    {
      "name": "Bobabase block explorer",
      "url": "https://blockexplorer.bobabase.boba.network",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "bobabase-testnet"
} as const satisfies Chain;