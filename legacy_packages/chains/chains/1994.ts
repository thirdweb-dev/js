import type { Chain } from "../src/types";
export default {
  "chain": "EKTA",
  "chainId": 1994,
  "explorers": [
    {
      "name": "ektascan",
      "url": "https://ektascan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.ekta.io",
  "name": "Ekta",
  "nativeCurrency": {
    "name": "EKTA",
    "symbol": "EKTA",
    "decimals": 18
  },
  "networkId": 1994,
  "rpc": [
    "https://1994.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://main.ekta.io"
  ],
  "shortName": "ekta",
  "slug": "ekta",
  "testnet": false
} as const satisfies Chain;