import type { Chain } from "../src/types";
export default {
  "chain": "ATH",
  "chainId": 1620,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://atheios.org",
  "name": "Atheios",
  "nativeCurrency": {
    "name": "Atheios Ether",
    "symbol": "ATH",
    "decimals": 18
  },
  "networkId": 11235813,
  "rpc": [
    "https://atheios.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1620.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.atheios.org/"
  ],
  "shortName": "ath",
  "slip44": 1620,
  "slug": "atheios",
  "testnet": false
} as const satisfies Chain;