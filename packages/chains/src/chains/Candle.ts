import type { Chain } from "../types";
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
  "infoURL": "https://candlelabs.org/",
  "name": "Candle",
  "nativeCurrency": {
    "name": "CANDLE",
    "symbol": "CNDL",
    "decimals": 18
  },
  "networkId": 534,
  "rpc": [
    "https://candle.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://534.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://candle-rpc.com/",
    "https://rpc.cndlchain.com"
  ],
  "shortName": "CNDL",
  "slip44": 674,
  "slug": "candle",
  "testnet": false
} as const satisfies Chain;