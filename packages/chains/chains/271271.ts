import type { Chain } from "../src/types";
export default {
  "chain": "EGON",
  "chainId": 271271,
  "explorers": [
    {
      "name": "EgonCoin Testnet",
      "url": "https://testnet.egonscan.com",
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
  "name": "EgonCoin Testnet",
  "nativeCurrency": {
    "name": "EgonCoin",
    "symbol": "EGON",
    "decimals": 18
  },
  "networkId": 271271,
  "rpc": [
    "https://egoncoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://271271.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.egonscan.com"
  ],
  "shortName": "EGONt",
  "slip44": 1,
  "slug": "egoncoin-testnet",
  "testnet": true
} as const satisfies Chain;