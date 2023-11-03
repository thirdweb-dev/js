import type { Chain } from "../types";
export default {
  "chain": "VAL",
  "chainId": 38,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://valorbit.com",
  "name": "Valorbit",
  "nativeCurrency": {
    "name": "Valorbit",
    "symbol": "VAL",
    "decimals": 18
  },
  "networkId": 38,
  "rpc": [
    "https://valorbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://38.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.valorbit.com/v2"
  ],
  "shortName": "val",
  "slip44": 538,
  "slug": "valorbit",
  "testnet": false
} as const satisfies Chain;