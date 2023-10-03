import type { Chain } from "../src/types";
export default {
  "chain": "MeshTestChain",
  "chainId": 600,
  "explorers": [],
  "faucets": [],
  "features": [],
  "name": "Meshnyan testnet",
  "nativeCurrency": {
    "name": "Meshnyan Testnet Native Token",
    "symbol": "MESHT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "mesh-chain-testnet",
  "slug": "meshnyan-testnet",
  "testnet": true
} as const satisfies Chain;