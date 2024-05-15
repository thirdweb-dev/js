import type { Chain } from "../src/types";
export default {
  "chain": "3839",
  "chainId": 3839,
  "explorers": [
    {
      "name": "traderlands explorer",
      "url": "https://sepolia.arbiscan.io/",
      "standard": "standard",
      "icon": {
        "url": "ipfs://QmRQVgjLcoWAVTocuYegwumz8J8b2F3Le2WnQhwffRmWcg/traderlands%20logo.png",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmRQVgjLcoWAVTocuYegwumz8J8b2F3Le2WnQhwffRmWcg/traderlands%20logo.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://sepolia.arbiscan.io/",
  "name": "traderlands-sepolia",
  "nativeCurrency": {
    "name": "Traderlands",
    "symbol": "TRADE",
    "decimals": 18
  },
  "networkId": 3839,
  "redFlags": [],
  "rpc": [
    "https://3839.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://traderlands-sepolia.rpc.caldera.xyz/http"
  ],
  "shortName": "Tradetest",
  "slug": "traderlands-sepolia",
  "testnet": true
} as const satisfies Chain;