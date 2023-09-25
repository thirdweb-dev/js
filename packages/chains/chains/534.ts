import type { Chain } from "../src/types";
export default {
  "chainId": 534,
  "chain": "Candle",
  "name": "Candle",
  "rpc": [
    "https://candle.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://candle-rpc.com/",
    "https://rpc.cndlchain.com"
  ],
  "slug": "candle",
  "faucets": [],
  "nativeCurrency": {
    "name": "CANDLE",
    "symbol": "CNDL",
    "decimals": 18
  },
  "infoURL": "https://candlelabs.org/",
  "shortName": "CNDL",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "candleexplorer",
      "url": "https://candleexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;