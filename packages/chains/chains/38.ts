import type { Chain } from "../src/types";
export default {
  "name": "Valorbit",
  "chain": "VAL",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Valorbit",
    "symbol": "VAL",
    "decimals": 18
  },
  "infoURL": "https://valorbit.com",
  "shortName": "val",
  "chainId": 38,
  "networkId": 38,
  "slip44": 538,
  "testnet": false,
  "slug": "valorbit"
} as const satisfies Chain;