import type { Chain } from "../src/types";
export default {
  "name": "Genesis Coin",
  "chain": "Genesis",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "GN Coin",
    "symbol": "GNC",
    "decimals": 18
  },
  "infoURL": "https://genesis-gn.com",
  "shortName": "GENEC",
  "chainId": 9100,
  "networkId": 9100,
  "testnet": false,
  "slug": "genesis-coin"
} as const satisfies Chain;