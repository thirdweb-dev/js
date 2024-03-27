import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 43111,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://hemi.xyz",
  "name": "Hemi Network",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 43111,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [],
  "shortName": "hemi",
  "slug": "hemi-network",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;