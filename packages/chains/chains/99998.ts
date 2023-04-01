import type { Chain } from "../src/types";
export default {
  "name": "UB Smart Chain(testnet)",
  "chain": "USC",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "infoURL": "https://www.ubchain.site",
  "shortName": "usctest",
  "chainId": 99998,
  "networkId": 99998,
  "testnet": true,
  "slug": "ub-smart-chain-testnet"
} as const satisfies Chain;