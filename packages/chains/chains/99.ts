import type { Chain } from "../src/types";
export default {
  "chain": "POA",
  "chainId": 99,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/poa/core",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://poa.network",
  "name": "POA Network Core",
  "nativeCurrency": {
    "name": "POA Network Core Ether",
    "symbol": "POA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://poa-network-core.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://core.poa.network"
  ],
  "shortName": "poa",
  "slug": "poa-network-core",
  "testnet": false
} as const satisfies Chain;