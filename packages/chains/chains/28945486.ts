import type { Chain } from "../src/types";
export default {
  "name": "Auxilium Network Mainnet",
  "chain": "AUX",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Auxilium coin",
    "symbol": "AUX",
    "decimals": 18
  },
  "infoURL": "https://auxilium.global",
  "shortName": "auxi",
  "chainId": 28945486,
  "networkId": 28945486,
  "slip44": 344,
  "testnet": false,
  "slug": "auxilium-network"
} as const satisfies Chain;