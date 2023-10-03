import type { Chain } from "../src/types";
export default {
  "chain": "EGON",
  "chainId": 271,
  "explorers": [
    {
      "name": "EgonCoin Mainnet",
      "url": "https://egcscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.egcscan.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmNZiMmzMQYjyGtNSghtzLg4UooYhDgMQsa677DAP5KsBg",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://egcscan.com",
  "name": "EgonCoin Mainnet",
  "nativeCurrency": {
    "name": "EgonCoin",
    "symbol": "EGON",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://egoncoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.egcscan.com"
  ],
  "shortName": "EGONm",
  "slug": "egoncoin",
  "testnet": false
} as const satisfies Chain;