import type { Chain } from "../src/types";
export default {
  "chain": "VAL",
  "chainId": 38,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://valorbit.com",
  "name": "Valorbit",
  "nativeCurrency": {
    "name": "Valorbit",
    "symbol": "VAL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://valorbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.valorbit.com/v2"
  ],
  "shortName": "val",
  "slug": "valorbit",
  "testnet": false
} as const satisfies Chain;