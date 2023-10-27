import type { Chain } from "../src/types";
export default {
  "chain": "GeneChain",
  "chainId": 80,
  "explorers": [
    {
      "name": "GeneChain Scan",
      "url": "https://scan.genechain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://scan.genechain.io/",
  "name": "GeneChain",
  "nativeCurrency": {
    "name": "RNA",
    "symbol": "RNA",
    "decimals": 18
  },
  "networkId": 80,
  "rpc": [
    "https://genechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://80.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.genechain.io"
  ],
  "shortName": "GeneChain",
  "slug": "genechain",
  "testnet": false
} as const satisfies Chain;