import type { Chain } from "../src/types";
export default {
  "chainId": 99998,
  "chain": "USC",
  "name": "UB Smart Chain(testnet)",
  "rpc": [
    "https://ub-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.uschain.network"
  ],
  "slug": "ub-smart-chain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "infoURL": "https://www.ubchain.site",
  "shortName": "usctest",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;