import type { Chain } from "../src/types";
export default {
  "chain": "DGS",
  "chainId": 6363,
  "explorers": [],
  "faucets": [],
  "name": "Digit Soul Smart Chain",
  "nativeCurrency": {
    "name": "Digit Coin",
    "symbol": "DGC",
    "decimals": 18
  },
  "networkId": 6363,
  "rpc": [
    "https://digit-soul-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6363.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://dsc-rpc.digitsoul.co.th"
  ],
  "shortName": "DGS",
  "slug": "digit-soul-smart-chain",
  "testnet": false
} as const satisfies Chain;