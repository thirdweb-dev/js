import type { Chain } from "../src/types";
export default {
  "chain": "ZERO",
  "chainId": 12052,
  "explorers": [
    {
      "name": "zeroscan",
      "url": "https://zeroscan.singularity.gold",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://zeroscan.singularity.gold"
  ],
  "features": [],
  "infoURL": "https://www.singularity.gold",
  "name": "Singularity ZERO Mainnet",
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "tZERO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://singularity-zero.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zerorpc.singularity.gold"
  ],
  "shortName": "ZERO",
  "slug": "singularity-zero",
  "testnet": false
} as const satisfies Chain;