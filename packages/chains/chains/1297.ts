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
  "infoURL": "https://boba.network",
  "name": "Bobabase Testnet",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "networkId": 1297,
  "rpc": [
    "https://1297.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobabase.boba.network",
    "wss://wss.bobabase.boba.network",
    "https://replica.bobabase.boba.network",
    "wss://replica-wss.bobabase.boba.network"
  ],
  "shortName": "Bobabase",
  "slip44": 1,
  "slug": "bobabase-testnet",
  "testnet": true
} as const satisfies Chain;