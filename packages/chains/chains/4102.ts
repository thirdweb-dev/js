import type { Chain } from "../src/types";
export default {
  "chainId": 4102,
  "chain": "AIOZ",
  "name": "AIOZ Network Testnet",
  "rpc": [
    "https://aioz-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-ds.testnet.aioz.network"
  ],
  "slug": "aioz-network-testnet",
  "icon": {
    "url": "ipfs://QmRAGPFhvQiXgoJkui7WHajpKctGFrJNhHqzYdwcWt5V3Z",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "testAIOZ",
    "symbol": "AIOZ",
    "decimals": 18
  },
  "infoURL": "https://aioz.network",
  "shortName": "aioz-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "AIOZ Network Testnet Explorer",
      "url": "https://testnet.explorer.aioz.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;