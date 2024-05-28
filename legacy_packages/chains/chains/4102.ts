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
  "networkId": 4102,
  "rpc": [
    "https://4102.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-ds.testnet.aioz.network"
  ],
  "shortName": "aioz-testnet",
  "slip44": 1,
  "slug": "aioz-network-testnet",
  "testnet": true
} as const satisfies Chain;