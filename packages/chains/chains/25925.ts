import type { Chain } from "../src/types";
export default {
  "chainId": 25925,
  "chain": "BKC",
  "name": "Bitkub Chain Testnet",
  "rpc": [
    "https://bitkub-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bitkubchain.io",
    "wss://wss-testnet.bitkubchain.io"
  ],
  "slug": "bitkub-chain-testnet",
  "icon": {
    "url": "ipfs://QmYFYwyquipwc9gURQGcEd4iAq7pq15chQrJ3zJJe9HuFT",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "bkcscan-testnet",
      "url": "https://testnet.bkcscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;