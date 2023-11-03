import type { Chain } from "../types";
export default {
  "chain": "AKA",
  "chainId": 200625,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://akroma.io",
  "name": "Akroma",
  "nativeCurrency": {
    "name": "Akroma Ether",
    "symbol": "AKA",
    "decimals": 18
  },
  "networkId": 200625,
  "rpc": [
    "https://akroma.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://200625.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://remote.akroma.io"
  ],
  "shortName": "aka",
  "slip44": 200625,
  "slug": "akroma",
  "testnet": false
} as const satisfies Chain;