import type { Chain } from "../src/types";
export default {
  "chain": "USD",
  "chainId": 8087,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://e-dollar.org",
  "name": "E-Dollar",
  "nativeCurrency": {
    "name": "E-Dollar",
    "symbol": "USD",
    "decimals": 18
  },
  "networkId": 8087,
  "rpc": [
    "https://8087.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.e-dollar.org"
  ],
  "shortName": "E-Dollar",
  "slug": "e-dollar",
  "testnet": false
} as const satisfies Chain;