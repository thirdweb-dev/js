import type { Chain } from "../src/types";
export default {
  "chainId": 38,
  "chain": "VAL",
  "name": "Valorbit",
  "rpc": [
    "https://valorbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.valorbit.com/v2"
  ],
  "slug": "valorbit",
  "faucets": [],
  "nativeCurrency": {
    "name": "Valorbit",
    "symbol": "VAL",
    "decimals": 18
  },
  "infoURL": "https://valorbit.com",
  "shortName": "val",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;