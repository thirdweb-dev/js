import type { Chain } from "../src/types";
export default {
  "name": "Lisinski",
  "chain": "CRO",
  "rpc": [],
  "faucets": [
    "https://pipa.lisinski.online"
  ],
  "nativeCurrency": {
    "name": "Lisinski Ether",
    "symbol": "LISINS",
    "decimals": 18
  },
  "infoURL": "https://lisinski.online",
  "shortName": "lisinski",
  "chainId": 385,
  "networkId": 385,
  "testnet": false,
  "slug": "lisinski"
} as const satisfies Chain;