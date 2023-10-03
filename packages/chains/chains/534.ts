import type { Chain } from "../src/types";
export default {
  "chain": "Candle",
  "chainId": 534,
  "explorers": [
    {
      "name": "candleexplorer",
      "url": "https://candleexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://candlelabs.org/",
  "name": "Candle",
  "nativeCurrency": {
    "name": "CANDLE",
    "symbol": "CNDL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://candle.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://candle-rpc.com/",
    "https://rpc.cndlchain.com"
  ],
  "shortName": "CNDL",
  "slug": "candle",
  "testnet": false
} as const satisfies Chain;