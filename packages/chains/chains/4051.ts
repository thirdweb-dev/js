import type { Chain } from "../src/types";
export default {
  "chain": "Bobaopera Testnet",
  "chainId": 4051,
  "explorers": [
    {
      "name": "Bobaopera Testnet block explorer",
      "url": "https://blockexplorer.testnet.bobaopera.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://boba.network",
  "name": "Bobaopera Testnet",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bobaopera-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bobaopera.boba.network",
    "wss://wss.testnet.bobaopera.boba.network",
    "https://replica.testnet.bobaopera.boba.network",
    "wss://replica-wss.testnet.bobaopera.boba.network"
  ],
  "shortName": "BobaoperaTestnet",
  "slug": "bobaopera-testnet",
  "testnet": true
} as const satisfies Chain;