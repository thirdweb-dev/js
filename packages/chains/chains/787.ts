import type { Chain } from "../src/types";
export default {
  "name": "Acala Network",
  "chain": "ACA",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Acala Token",
    "symbol": "ACA",
    "decimals": 18
  },
  "infoURL": "https://acala.network",
  "shortName": "aca",
  "chainId": 787,
  "networkId": 787,
  "slip44": 787,
  "testnet": false,
  "slug": "acala-network"
} as const satisfies Chain;