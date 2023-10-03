import type { Chain } from "../src/types";
export default {
  "chain": "AIOZ",
  "chainId": 168,
  "explorers": [
    {
      "name": "AIOZ Network Explorer",
      "url": "https://explorer.aioz.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmRAGPFhvQiXgoJkui7WHajpKctGFrJNhHqzYdwcWt5V3Z",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://aioz.network",
  "name": "AIOZ Network",
  "nativeCurrency": {
    "name": "AIOZ",
    "symbol": "AIOZ",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://aioz-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-dataseed.aioz.network"
  ],
  "shortName": "aioz",
  "slug": "aioz-network",
  "testnet": false
} as const satisfies Chain;