import type { Chain } from "../src/types";
export default {
  "name": "Singularity ZERO Testnet",
  "chain": "ZERO",
  "rpc": [],
  "faucets": [
    "https://nft.singularity.gold"
  ],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "tZERO",
    "decimals": 18
  },
  "infoURL": "https://www.singularity.gold",
  "shortName": "tZERO",
  "chainId": 12051,
  "networkId": 12051,
  "explorers": [
    {
      "name": "zeroscan",
      "url": "https://betaenv.singularity.gold:18002",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "singularity-zero-testnet"
} as const satisfies Chain;