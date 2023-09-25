import type { Chain } from "../src/types";
export default {
  "chainId": 9728,
  "chain": "Boba BNB Testnet",
  "name": "Boba BNB Testnet",
  "rpc": [
    "https://boba-bnb-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bnb.boba.network",
    "wss://wss.testnet.bnb.boba.network",
    "https://replica.testnet.bnb.boba.network",
    "wss://replica-wss.testnet.bnb.boba.network",
    "https://boba-bnb-testnet.gateway.tenderly.co",
    "wss://boba-bnb-testnet.gateway.tenderly.co"
  ],
  "slug": "boba-bnb-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaBnbTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Boba BNB Testnet block explorer",
      "url": "https://blockexplorer.testnet.bnb.boba.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;