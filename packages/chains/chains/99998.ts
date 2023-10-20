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
    "https://ub-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://99998.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.uschain.network"
  ],
  "shortName": "usctest",
  "slug": "ub-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;