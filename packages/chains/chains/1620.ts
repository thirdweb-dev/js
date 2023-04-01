import type { Chain } from "../src/types";
export default {
  "name": "Atheios",
  "chain": "ATH",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Atheios Ether",
    "symbol": "ATH",
    "decimals": 18
  },
  "infoURL": "https://atheios.com",
  "shortName": "ath",
  "chainId": 1620,
  "networkId": 11235813,
  "slip44": 1620,
  "testnet": false,
  "slug": "atheios"
} as const satisfies Chain;