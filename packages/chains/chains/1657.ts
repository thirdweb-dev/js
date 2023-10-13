import type { Chain } from "../src/types";
export default {
  "chain": "btachain",
  "chainId": 1657,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://bitcoinasset.io/",
  "name": "Btachain",
  "nativeCurrency": {
    "name": "Bitcoin Asset",
    "symbol": "BTA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://btachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed1.btachain.com/"
  ],
  "shortName": "bta",
  "slug": "btachain",
  "testnet": false
} as const satisfies Chain;