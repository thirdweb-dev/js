import type { Chain } from "../types";
export default {
  "chain": "EGON",
  "chainId": 271,
  "explorers": [
    {
      "name": "EgonCoin Mainnet",
      "url": "https://egonscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.egonscan.com"
  ],
  "icon": {
    "url": "ipfs://QmNZiMmzMQYjyGtNSghtzLg4UooYhDgMQsa677DAP5KsBg",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://egonscan.com",
  "name": "EgonCoin Mainnet",
  "nativeCurrency": {
    "name": "EgonCoin",
    "symbol": "EGON",
    "decimals": 18
  },
  "networkId": 271,
  "rpc": [
    "https://egoncoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://271.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.egonscan.com"
  ],
  "shortName": "EGONm",
  "slug": "egoncoin",
  "testnet": false
} as const satisfies Chain;