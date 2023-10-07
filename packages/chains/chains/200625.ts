import type { Chain } from "../src/types";
export default {
  "chain": "AKA",
  "chainId": 200625,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://akroma.io",
  "name": "Akroma",
  "nativeCurrency": {
    "name": "Akroma Ether",
    "symbol": "AKA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://akroma.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://remote.akroma.io"
  ],
  "shortName": "aka",
  "slug": "akroma",
  "testnet": false
} as const satisfies Chain;