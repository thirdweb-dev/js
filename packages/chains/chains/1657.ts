import type { Chain } from "../src/types";
export default {
  "name": "Btachain",
  "chain": "btachain",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Asset",
    "symbol": "BTA",
    "decimals": 18
  },
  "infoURL": "https://bitcoinasset.io/",
  "shortName": "bta",
  "chainId": 1657,
  "networkId": 1657,
  "testnet": false,
  "slug": "btachain"
} as const satisfies Chain;