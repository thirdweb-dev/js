import type { Chain } from "../src/types";
export default {
  "name": "EgonCoin Testnet",
  "chain": "EGON",
  "icon": {
    "url": "ipfs://QmNZiMmzMQYjyGtNSghtzLg4UooYhDgMQsa677DAP5KsBg",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://egoncoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.egcscan.com"
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
  "shortName": "EGONt",
  "chainId": 271271,
  "networkId": 271271,
  "explorers": [
    {
      "name": "EgonCoin Testnet",
      "url": "https://testnet.egcscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "egoncoin-testnet"
} as const satisfies Chain;