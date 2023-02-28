export default {
  "name": "Quadrans Blockchain Testnet",
  "chain": "tQDC",
  "icon": {
    "url": "ipfs://QmZFiYHnE4TrezPz8wSap9nMxG6m98w4fv7ataj2TfLNck",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://quadrans-blockchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.quadrans.io",
    "https://rpctest2.quadrans.io"
  ],
  "faucets": [
    "https://faucetpage.quadrans.io"
  ],
  "nativeCurrency": {
    "name": "Quadrans Testnet Coin",
    "symbol": "tQDC",
    "decimals": 18
  },
  "infoURL": "https://quadrans.io",
  "shortName": "quadranstestnet",
  "chainId": 10947,
  "networkId": 10947,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.testnet.quadrans.io",
      "icon": "quadrans",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "quadrans-blockchain-testnet"
} as const;