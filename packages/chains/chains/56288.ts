import type { Chain } from "../src/types";
export default {
  "chainId": 56288,
  "chain": "Boba BNB Mainnet",
  "name": "Boba BNB Mainnet",
  "rpc": [
    "https://boba-bnb.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bnb.boba.network",
    "https://boba-bnb.gateway.tenderly.co/",
    "https://gateway.tenderly.co/public/boba-bnb",
    "https://replica.bnb.boba.network",
    "wss://boba-bnb.gateway.tenderly.co/",
    "wss://gateway.tenderly.co/public/boba-bnb"
  ],
  "slug": "boba-bnb",
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaBnb",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Boba BNB block explorer",
      "url": "https://blockexplorer.bnb.boba.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;