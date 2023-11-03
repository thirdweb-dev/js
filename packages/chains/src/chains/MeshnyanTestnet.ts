import type { Chain } from "../types";
export default {
  "chain": "MeshTestChain",
  "chainId": 600,
  "explorers": [],
  "faucets": [],
  "name": "Meshnyan testnet",
  "nativeCurrency": {
    "name": "Meshnyan Testnet Native Token",
    "symbol": "MESHT",
    "decimals": 18
  },
  "networkId": 600,
  "rpc": [],
  "shortName": "mesh-chain-testnet",
  "slug": "meshnyan-testnet",
  "testnet": true
} as const satisfies Chain;