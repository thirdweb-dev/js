import type { Chain } from "../src/types";
export default {
  "chainId": 96,
  "chain": "BKC",
  "name": "Bitkub Chain",
  "rpc": [
    "https://bitkub-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitkubchain.io",
    "wss://wss.bitkubchain.io"
  ],
  "slug": "bitkub-chain",
  "icon": {
    "url": "ipfs://QmYFYwyquipwc9gURQGcEd4iAq7pq15chQrJ3zJJe9HuFT",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitkub Coin",
    "symbol": "tKUB",
    "decimals": 18
  },
  "infoURL": "https://www.bitkubchain.com/",
  "shortName": "bkc",
  "testnet": false,
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "Bitkub Chain Explorer",
      "url": "https://bkcscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;