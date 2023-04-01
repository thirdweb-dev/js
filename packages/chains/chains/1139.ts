import type { Chain } from "../src/types";
export default {
  "name": "MathChain",
  "chain": "MATH",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "MathChain",
    "symbol": "MATH",
    "decimals": 18
  },
  "infoURL": "https://mathchain.org",
  "shortName": "MATH",
  "chainId": 1139,
  "networkId": 1139,
  "testnet": false,
  "slug": "mathchain"
} as const satisfies Chain;