export default {
  "name": "Bitkub Chain Testnet",
  "chain": "BKC",
  "icon": {
    "url": "ipfs://QmYFYwyquipwc9gURQGcEd4iAq7pq15chQrJ3zJJe9HuFT",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [
    "https://bitkub-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bitkubchain.io",
    "wss://wss-testnet.bitkubchain.io"
  ],
  "faucets": [
    "https://faucet.bitkubchain.com"
  ],
  "nativeCurrency": {
    "name": "Bitkub Coin",
    "symbol": "tKUB",
    "decimals": 18
  },
  "infoURL": "https://www.bitkubchain.com/",
  "shortName": "bkct",
  "chainId": 25925,
  "networkId": 25925,
  "explorers": [
    {
      "name": "bkcscan-testnet",
      "url": "https://testnet.bkcscan.com",
      "standard": "none",
      "icon": "bkc"
    }
  ],
  "testnet": true,
  "slug": "bitkub-chain-testnet"
} as const;