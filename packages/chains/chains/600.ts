import type { Chain } from "../src/types";
export default {
  "chainId": 600,
  "chain": "MeshTestChain",
  "name": "Meshnyan testnet",
  "rpc": [],
  "slug": "meshnyan-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Meshnyan Testnet Native Token",
    "symbol": "MESHT",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "mesh-chain-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;