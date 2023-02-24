export default {
  "name": "Bitkub Chain",
  "chain": "BKC",
  "icon": {
    "url": "ipfs://QmYFYwyquipwc9gURQGcEd4iAq7pq15chQrJ3zJJe9HuFT",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [
    "https://bitkub-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitkubchain.io",
    "wss://wss.bitkubchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitkub Coin",
    "symbol": "KUB",
    "decimals": 18
  },
  "infoURL": "https://www.bitkubchain.com/",
  "shortName": "bkc",
  "chainId": 96,
  "networkId": 96,
  "explorers": [
    {
      "name": "Bitkub Chain Explorer",
      "url": "https://bkcscan.com",
      "standard": "none",
      "icon": "bkc"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ],
  "testnet": false,
  "slug": "bitkub-chain"
} as const;