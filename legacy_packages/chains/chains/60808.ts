import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 60808,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://gobob.xyz",
  "name": "BOB",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 60808,
  "rpc": [],
  "shortName": "bob",
  "slug": "bob",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;