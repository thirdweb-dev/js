import type { Chain } from "../src/types";
export default {
  "chain": "ATH",
  "chainId": 1620,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://atheios.org",
  "name": "Atheios",
  "nativeCurrency": {
    "name": "Atheios Ether",
    "symbol": "ATH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://atheios.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.atheios.org/"
  ],
  "shortName": "ath",
  "slug": "atheios",
  "testnet": false
} as const satisfies Chain;