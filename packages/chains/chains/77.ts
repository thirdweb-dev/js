import type { Chain } from "../src/types";
export default {
  "chainId": 77,
  "chain": "POA",
  "name": "POA Network Sokol",
  "rpc": [
    "https://poa-network-sokol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sokol.poa.network",
    "wss://sokol.poa.network/wss",
    "ws://sokol.poa.network:8546"
  ],
  "slug": "poa-network-sokol",
  "faucets": [],
  "nativeCurrency": {
    "name": "POA Sokol Ether",
    "symbol": "SPOA",
    "decimals": 18
  },
  "infoURL": "https://poa.network",
  "shortName": "spoa",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/poa/sokol",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;