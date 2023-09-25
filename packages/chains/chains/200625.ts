import type { Chain } from "../src/types";
export default {
  "chainId": 200625,
  "chain": "AKA",
  "name": "Akroma",
  "rpc": [
    "https://akroma.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://remote.akroma.io"
  ],
  "slug": "akroma",
  "faucets": [],
  "nativeCurrency": {
    "name": "Akroma Ether",
    "symbol": "AKA",
    "decimals": 18
  },
  "infoURL": "https://akroma.io",
  "shortName": "aka",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;