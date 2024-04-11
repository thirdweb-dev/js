import type { Chain } from "../src/types";
export default {
  "chain": "DoCoin",
  "chainId": 526916,
  "explorers": [
    {
      "name": "DoCoin Community Chain Explorer",
      "url": "https://explorer.docoin.shop",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://docoin.network",
  "name": "DoCoin Community Chain",
  "nativeCurrency": {
    "name": "DO",
    "symbol": "DCT",
    "decimals": 18
  },
  "networkId": 526916,
  "rpc": [
    "https://526916.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.docoin.shop"
  ],
  "shortName": "DoCoin",
  "slug": "docoin-community-chain",
  "testnet": false,
  "title": "DoCoin Community Chain"
} as const satisfies Chain;