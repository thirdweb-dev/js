import type { Chain } from "../src/types";
export default {
  "chainId": 1620,
  "chain": "ATH",
  "name": "Atheios",
  "rpc": [
    "https://atheios.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.atheios.org/"
  ],
  "slug": "atheios",
  "faucets": [],
  "nativeCurrency": {
    "name": "Atheios Ether",
    "symbol": "ATH",
    "decimals": 18
  },
  "infoURL": "https://atheios.org",
  "shortName": "ath",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;