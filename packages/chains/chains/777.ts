import type { Chain } from "../src/types";
export default {
  "name": "cheapETH",
  "chain": "cheapETH",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "cTH",
    "symbol": "cTH",
    "decimals": 18
  },
  "infoURL": "https://cheapeth.org/",
  "shortName": "cth",
  "chainId": 777,
  "networkId": 777,
  "testnet": false,
  "slug": "cheapeth"
} as const satisfies Chain;