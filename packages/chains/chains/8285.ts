import type { Chain } from "../src/types";
export default {
  "chain": "Kortho",
  "chainId": 8285,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.kortho.io/",
  "name": "KorthoTest",
  "nativeCurrency": {
    "name": "Kortho Test",
    "symbol": "KTO",
    "decimals": 11
  },
  "networkId": 8285,
  "rpc": [
    "https://korthotest.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8285.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.krotho-test.net"
  ],
  "shortName": "Kortho",
  "slip44": 1,
  "slug": "korthotest",
  "testnet": true
} as const satisfies Chain;