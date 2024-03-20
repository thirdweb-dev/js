import type { Chain } from "../src/types";
export default {
  "chain": "USC",
  "chainId": 99998,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.ubchain.site",
  "name": "UB Smart Chain(testnet)",
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "networkId": 99998,
  "rpc": [
    "https://99998.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.uschain.network"
  ],
  "shortName": "usctest",
  "slip44": 1,
  "slug": "ub-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;