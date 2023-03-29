export default {
  "name": "SanR Chain",
  "chain": "SanRChain",
  "rpc": [
    "https://sanr-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sanrchain-node.santiment.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "nSAN",
    "symbol": "nSAN",
    "decimals": 18
  },
  "infoURL": "https://sanr.app",
  "shortName": "SAN",
  "chainId": 11888,
  "networkId": 11888,
  "icon": {
    "url": "ipfs://QmPLMg5mYD8XRknvYbDkD2x7FXxYan7MPTeUWZC2CihwDM",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "parent": {
    "chain": "eip155-1",
    "type": "L2",
    "bridges": [
      {
        "url": "https://sanr.app"
      }
    ]
  },
  "explorers": [
    {
      "name": "SanR Chain Explorer",
      "url": "https://sanrchain-explorer.santiment.net",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "sanr-chain"
} as const;