import type { Chain } from "../types";
export default {
  "chain": "BKC",
  "chainId": 25925,
  "explorers": [
    {
      "name": "bkcscan-testnet",
      "url": "https://testnet.bkcscan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmYFYwyquipwc9gURQGcEd4iAq7pq15chQrJ3zJJe9HuFT",
        "width": 1000,
        "height": 1000,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.bitkubchain.com"
  ],
  "icon": {
    "url": "ipfs://QmYFYwyquipwc9gURQGcEd4iAq7pq15chQrJ3zJJe9HuFT",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://www.bitkubchain.com/",
  "name": "Bitkub Chain Testnet",
  "nativeCurrency": {
    "name": "Bitkub Coin",
    "symbol": "tKUB",
    "decimals": 18
  },
  "networkId": 25925,
  "rpc": [
    "https://bitkub-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://25925.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bitkubchain.io",
    "wss://wss-testnet.bitkubchain.io"
  ],
  "shortName": "bkct",
  "slug": "bitkub-chain-testnet",
  "testnet": true
} as const satisfies Chain;