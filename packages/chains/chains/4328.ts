import type { Chain } from "../src/types";
export default {
  "chainId": 4328,
  "chain": "Bobafuji Testnet",
  "name": "Bobafuji Testnet",
  "rpc": [
    "https://bobafuji-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.avax.boba.network",
    "wss://wss.testnet.avax.boba.network",
    "https://replica.testnet.avax.boba.network"
  ],
  "slug": "bobafuji-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaFujiTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bobafuji Testnet block explorer",
      "url": "https://blockexplorer.testnet.avax.boba.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;