import type { Chain } from "../src/types";
export default {
  "chain": "JaiHoChain",
  "chainId": 1313,
  "explorers": [
    {
      "name": "JaiHo Chain Explorer",
      "url": "https://jaihochain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmUtKXY4N9kNCs9hAkAyi1nsvMWvDzs5vUjgYXTJoZCYqu",
    "width": 450,
    "height": 450,
    "format": "png"
  },
  "infoURL": "https://jaihochain.com",
  "name": "JaiHo Chain",
  "nativeCurrency": {
    "name": "JaiHo",
    "symbol": "JaiHo",
    "decimals": 18
  },
  "networkId": 1313,
  "rpc": [
    "https://1313.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jaihochain.com"
  ],
  "shortName": "JHC",
  "slug": "jaiho-chain",
  "testnet": false
} as const satisfies Chain;