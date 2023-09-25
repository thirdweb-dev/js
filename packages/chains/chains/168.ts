import type { Chain } from "../src/types";
export default {
  "chainId": 168,
  "chain": "AIOZ",
  "name": "AIOZ Network",
  "rpc": [
    "https://aioz-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-dataseed.aioz.network"
  ],
  "slug": "aioz-network",
  "icon": {
    "url": "ipfs://QmRAGPFhvQiXgoJkui7WHajpKctGFrJNhHqzYdwcWt5V3Z",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "AIOZ",
    "symbol": "AIOZ",
    "decimals": 18
  },
  "infoURL": "https://aioz.network",
  "shortName": "aioz",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "AIOZ Network Explorer",
      "url": "https://explorer.aioz.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;