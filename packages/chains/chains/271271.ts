import type { Chain } from "../src/types";
export default {
  "chainId": 271271,
  "chain": "EGON",
  "name": "EgonCoin Testnet",
  "rpc": [
    "https://egoncoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.egcscan.com"
  ],
  "slug": "egoncoin-testnet",
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
  "shortName": "EGONt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "EgonCoin Testnet",
      "url": "https://testnet.egcscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;