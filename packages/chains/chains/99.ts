import type { Chain } from "../src/types";
export default {
  "chainId": 99,
  "chain": "POA",
  "name": "POA Network Core",
  "rpc": [
    "https://poa-network-core.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://core.poa.network"
  ],
  "slug": "poa-network-core",
  "faucets": [],
  "nativeCurrency": {
    "name": "POA Network Core Ether",
    "symbol": "POA",
    "decimals": 18
  },
  "infoURL": "https://poa.network",
  "shortName": "poa",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/poa/core",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;