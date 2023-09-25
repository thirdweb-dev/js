import type { Chain } from "../src/types";
export default {
  "chainId": 4051,
  "chain": "Bobaopera Testnet",
  "name": "Bobaopera Testnet",
  "rpc": [
    "https://bobaopera-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bobaopera.boba.network",
    "wss://wss.testnet.bobaopera.boba.network",
    "https://replica.testnet.bobaopera.boba.network",
    "wss://replica-wss.testnet.bobaopera.boba.network"
  ],
  "slug": "bobaopera-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaoperaTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bobaopera Testnet block explorer",
      "url": "https://blockexplorer.testnet.bobaopera.boba.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;