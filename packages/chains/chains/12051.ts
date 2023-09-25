import type { Chain } from "../src/types";
export default {
  "chainId": 12051,
  "chain": "ZERO",
  "name": "Singularity ZERO Testnet",
  "rpc": [
    "https://singularity-zero-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://betaenv.singularity.gold:18545"
  ],
  "slug": "singularity-zero-testnet",
  "faucets": [
    "https://nft.singularity.gold"
  ],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "infoURL": "https://www.singularity.gold",
  "shortName": "tZERO",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "zeroscan",
      "url": "https://betaenv.singularity.gold:18002",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;