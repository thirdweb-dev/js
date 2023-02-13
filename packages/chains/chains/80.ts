export default {
  "name": "GeneChain",
  "chain": "GeneChain",
  "rpc": [
    "https://genechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.genechain.io"
  ],
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
} as const;