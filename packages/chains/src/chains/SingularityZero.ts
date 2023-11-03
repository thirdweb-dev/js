import type { Chain } from "../types";
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
  "infoURL": "https://www.singularity.gold",
  "name": "Singularity ZERO Mainnet",
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "networkId": 12052,
  "rpc": [
    "https://singularity-zero.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://12052.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zerorpc.singularity.gold"
  ],
  "shortName": "ZERO",
  "slip44": 621,
  "slug": "singularity-zero",
  "testnet": false
} as const satisfies Chain;