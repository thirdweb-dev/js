import type { Chain } from "../src/types";
export default {
  "chainId": 271,
  "chain": "EGON",
  "name": "EgonCoin Mainnet",
  "rpc": [
    "https://egoncoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.egcscan.com"
  ],
  "slug": "egoncoin",
  "icon": {
    "url": "ipfs://QmNZiMmzMQYjyGtNSghtzLg4UooYhDgMQsa677DAP5KsBg",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.egcscan.com"
  ],
  "nativeCurrency": {
    "name": "EgonCoin",
    "symbol": "EGON",
    "decimals": 18
  },
  "infoURL": "https://egcscan.com",
  "shortName": "EGONm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "EgonCoin Mainnet",
      "url": "https://egcscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;