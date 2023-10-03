import type { Chain } from "../src/types";
export default {
  "chain": "EGON",
  "chainId": 271271,
  "explorers": [
    {
      "name": "EgonCoin Testnet",
      "url": "https://testnet.egcscan.com",
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
  "name": "EgonCoin Testnet",
  "nativeCurrency": {
    "name": "EgonCoin",
    "symbol": "EGON",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://egoncoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.egcscan.com"
  ],
  "shortName": "EGONt",
  "slug": "egoncoin-testnet",
  "testnet": true
} as const satisfies Chain;