import type { Chain } from "../src/types";
export default {
  "chain": "ZERO",
  "chainId": 12051,
  "explorers": [
    {
      "name": "zeroscan",
      "url": "https://betaenv.singularity.gold:18002",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://nft.singularity.gold"
  ],
  "infoURL": "https://www.singularity.gold",
  "name": "Singularity ZERO Testnet",
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "tZERO",
    "decimals": 18
  },
  "networkId": 12051,
  "rpc": [
    "https://singularity-zero-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://12051.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://betaenv.singularity.gold:18545"
  ],
  "shortName": "tZERO",
  "slug": "singularity-zero-testnet",
  "testnet": true
} as const satisfies Chain;