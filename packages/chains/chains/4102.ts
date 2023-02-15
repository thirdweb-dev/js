export default {
  "name": "AIOZ Network Testnet",
  "chain": "AIOZ",
  "icon": {
    "url": "ipfs://QmRAGPFhvQiXgoJkui7WHajpKctGFrJNhHqzYdwcWt5V3Z",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://aioz-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-ds.testnet.aioz.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "testAIOZ",
    "symbol": "AIOZ",
    "decimals": 18
  },
  "infoURL": "https://aioz.network",
  "shortName": "aioz-testnet",
  "chainId": 4102,
  "networkId": 4102,
  "slip44": 60,
  "explorers": [
    {
      "name": "AIOZ Network Testnet Explorer",
      "url": "https://testnet.explorer.aioz.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "aioz-network-testnet"
} as const;