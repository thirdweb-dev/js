import type { Chain } from "../src/types";
export default {
  "chainId": 12052,
  "chain": "ZERO",
  "name": "Singularity ZERO Mainnet",
  "rpc": [
    "https://singularity-zero.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zerorpc.singularity.gold"
  ],
  "slug": "singularity-zero",
  "faucets": [
    "https://zeroscan.singularity.gold"
  ],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "infoURL": "https://www.singularity.gold",
  "shortName": "ZERO",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "zeroscan",
      "url": "https://zeroscan.singularity.gold",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;