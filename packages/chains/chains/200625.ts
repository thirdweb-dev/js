import type { Chain } from "../src/types";
export default {
  "name": "Akroma",
  "chain": "AKA",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Akroma Ether",
    "symbol": "AKA",
    "decimals": 18
  },
  "infoURL": "https://akroma.io",
  "shortName": "aka",
  "chainId": 200625,
  "networkId": 200625,
  "slip44": 200625,
  "testnet": false,
  "slug": "akroma"
} as const satisfies Chain;