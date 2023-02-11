export default {
  "name": "AIOZ Network",
  "chain": "AIOZ",
  "icon": {
    "url": "ipfs://QmRAGPFhvQiXgoJkui7WHajpKctGFrJNhHqzYdwcWt5V3Z",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://aioz-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-dataseed.aioz.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AIOZ",
    "symbol": "AIOZ",
    "decimals": 18
  },
  "infoURL": "https://aioz.network",
  "shortName": "aioz",
  "chainId": 168,
  "networkId": 168,
  "slip44": 60,
  "explorers": [
    {
      "name": "AIOZ Network Explorer",
      "url": "https://explorer.aioz.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "aioz-network"
} as const;