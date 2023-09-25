import type { Chain } from "../src/types";
export default {
  "chainId": 1657,
  "chain": "btachain",
  "name": "Btachain",
  "rpc": [
    "https://btachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed1.btachain.com/"
  ],
  "slug": "btachain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Asset",
    "symbol": "BTA",
    "decimals": 18
  },
  "infoURL": "https://bitcoinasset.io/",
  "shortName": "bta",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;