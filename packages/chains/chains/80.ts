import type { Chain } from "../src/types";
export default {
  "chainId": 80,
  "chain": "GeneChain",
  "name": "GeneChain",
  "rpc": [
    "https://genechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.genechain.io"
  ],
  "slug": "genechain",
  "faucets": [],
  "nativeCurrency": {
    "name": "RNA",
    "symbol": "RNA",
    "decimals": 18
  },
  "infoURL": "https://scan.genechain.io/",
  "shortName": "GeneChain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "GeneChain Scan",
      "url": "https://scan.genechain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;