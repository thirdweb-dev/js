import type { Chain } from "../src/types";
export default {
  "name": "Aurora Betanet",
  "chain": "NEAR",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://aurora.dev",
  "shortName": "aurora-betanet",
  "chainId": 1313161556,
  "networkId": 1313161556,
  "testnet": false,
  "slug": "aurora-betanet"
} as const satisfies Chain;