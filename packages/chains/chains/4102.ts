import type { Chain } from "../src/types";
export default {
  "chain": "AIOZ",
  "chainId": 4102,
  "explorers": [
    {
      "name": "AIOZ Network Testnet Explorer",
      "url": "https://testnet.explorer.aioz.network",
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
  "name": "AIOZ Network Testnet",
  "nativeCurrency": {
    "name": "testAIOZ",
    "symbol": "AIOZ",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://aioz-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-ds.testnet.aioz.network"
  ],
  "shortName": "aioz-testnet",
  "slug": "aioz-network-testnet",
  "testnet": true
} as const satisfies Chain;