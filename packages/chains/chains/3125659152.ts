import type { Chain } from "../src/types";
export default {
  "name": "Pirl",
  "chain": "PIRL",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Pirl Ether",
    "symbol": "PIRL",
    "decimals": 18
  },
  "infoURL": "https://pirl.io",
  "shortName": "pirl",
  "chainId": 3125659152,
  "networkId": 3125659152,
  "slip44": 164,
  "testnet": false,
  "slug": "pirl"
} as const satisfies Chain;