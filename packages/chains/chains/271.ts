import type { Chain } from "../src/types";
export default {
  "name": "EgonCoin Mainnet",
  "chain": "EGON",
  "icon": {
    "url": "ipfs://QmNZiMmzMQYjyGtNSghtzLg4UooYhDgMQsa677DAP5KsBg",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://egoncoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.egcscan.com"
  ],
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
  "chainId": 271,
  "networkId": 271,
  "explorers": [
    {
      "name": "EgonCoin Mainnet",
      "url": "https://egcscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "egoncoin"
} as const satisfies Chain;