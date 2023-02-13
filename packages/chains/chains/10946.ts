export default {
  "name": "Quadrans Blockchain",
  "chain": "QDC",
  "icon": {
    "url": "ipfs://QmZFiYHnE4TrezPz8wSap9nMxG6m98w4fv7ataj2TfLNck",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://quadrans-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.quadrans.io",
    "https://rpcna.quadrans.io",
    "https://rpceu.quadrans.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quadrans Coin",
    "symbol": "QDC",
    "decimals": 18
  },
  "infoURL": "https://quadrans.io",
  "shortName": "quadrans",
  "chainId": 10946,
  "networkId": 10946,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.quadrans.io",
      "icon": "quadrans",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quadrans-blockchain"
} as const;