export default {
  "name": "Graphlinq Blockchain Mainnet",
  "chain": "GLQ Blockchain",
  "rpc": [
    "https://graphlinq-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://glq-dataseed.graphlinq.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GLQ",
    "symbol": "GLQ",
    "decimals": 18
  },
  "infoURL": "https://graphlinq.io",
  "shortName": "glq",
  "chainId": 614,
  "networkId": 614,
  "explorers": [
    {
      "name": "GLQ Explorer",
      "url": "https://explorer.graphlinq.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "graphlinq-blockchain"
} as const;