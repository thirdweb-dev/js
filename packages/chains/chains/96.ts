import type { Chain } from "../src/types";
export default {
  "chain": "BKC",
  "chainId": 96,
  "explorers": [
    {
      "name": "Bitkub Chain Explorer",
      "url": "https://bkcscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmYFYwyquipwc9gURQGcEd4iAq7pq15chQrJ3zJJe9HuFT",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://www.bitkubchain.com/",
  "name": "Bitkub Chain",
  "nativeCurrency": {
    "name": "Bitkub Coin",
    "symbol": "KUB",
    "decimals": 18
  },
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://bitkub-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitkubchain.io",
    "wss://wss.bitkubchain.io"
  ],
  "shortName": "bkc",
  "slug": "bitkub-chain",
  "testnet": false
} as const satisfies Chain;