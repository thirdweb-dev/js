import type { Chain } from "../src/types";
export default {
  "name": "GeneChain",
  "chain": "GeneChain",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "RNA",
    "symbol": "RNA",
    "decimals": 18
  },
  "infoURL": "https://scan.genechain.io/",
  "shortName": "GeneChain",
  "chainId": 80,
  "networkId": 80,
  "explorers": [
    {
      "name": "GeneChain Scan",
      "url": "https://scan.genechain.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "genechain"
} as const satisfies Chain;