import type { Chain } from "../src/types";
export default {
  "name": "POA Network Core",
  "chain": "POA",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "POA Network Core Ether",
    "symbol": "POA",
    "decimals": 18
  },
  "infoURL": "https://poa.network",
  "shortName": "poa",
  "chainId": 99,
  "networkId": 99,
  "slip44": 178,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/poa/core",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "poa-network-core"
} as const satisfies Chain;