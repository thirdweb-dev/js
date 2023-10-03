import type { Chain } from "../src/types";
export default {
  "chain": "POA",
  "chainId": 77,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/poa/sokol",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://poa.network",
  "name": "POA Network Sokol",
  "nativeCurrency": {
    "name": "POA Sokol Ether",
    "symbol": "SPOA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://poa-network-sokol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sokol.poa.network",
    "wss://sokol.poa.network/wss",
    "ws://sokol.poa.network:8546"
  ],
  "shortName": "spoa",
  "slug": "poa-network-sokol",
  "testnet": false
} as const satisfies Chain;