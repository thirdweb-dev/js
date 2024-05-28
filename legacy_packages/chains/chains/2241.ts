import type { Chain } from "../src/types";
export default {
  "chain": "Krest",
  "chainId": 2241,
  "explorers": [
    {
      "name": "Polkadot.js",
      "url": "https://polkadot.js.org/apps/?rpc=wss://wss-krest.peaq.network#/explorer",
      "standard": "none"
    },
    {
      "name": "Subscan",
      "url": "https://krest.subscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.peaq.network",
  "name": "Krest Network",
  "nativeCurrency": {
    "name": "Krest",
    "symbol": "KRST",
    "decimals": 18
  },
  "networkId": 2241,
  "rpc": [
    "https://2241.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://erpc-krest.peaq.network",
    "https://krest.unitedbloc.com"
  ],
  "shortName": "KRST",
  "slug": "krest-network",
  "testnet": false
} as const satisfies Chain;