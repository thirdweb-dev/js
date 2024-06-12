import type { Chain } from "../src/types";
export default {
  "chain": "NEUROWEB",
  "chainId": 2043,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://neuroweb.ai",
  "name": "NeuroWeb",
  "nativeCurrency": {
    "name": "NeuroWeb Token",
    "symbol": "NEURO",
    "decimals": 12
  },
  "networkId": 2043,
  "rpc": [
    "https://2043.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://astrosat.origintrail.network",
    "wss://parachain-rpc.origin-trail.network"
  ],
  "shortName": "NEURO",
  "slug": "neuroweb",
  "testnet": false
} as const satisfies Chain;