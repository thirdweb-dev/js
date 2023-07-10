import type { Chain } from "../src/types";
export default {
  "name": "Atheios",
  "chain": "ATH",
  "rpc": [
    "https://atheios.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.atheios.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Atheios Ether",
    "symbol": "ATH",
    "decimals": 18
  },
  "infoURL": "https://atheios.org",
  "shortName": "ath",
  "chainId": 1620,
  "networkId": 11235813,
  "slip44": 1620,
  "testnet": false,
  "slug": "atheios"
} as const satisfies Chain;