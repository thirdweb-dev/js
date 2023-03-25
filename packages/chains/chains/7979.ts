export default {
  "name": "DOS Chain",
  "chain": "DOS",
  "rpc": [
    "https://dos-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://main.doschain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DOS",
    "symbol": "DOS",
    "decimals": 18
  },
  "infoURL": "https://doschain.io",
  "shortName": "dos",
  "chainId": 7979,
  "networkId": 7979,
  "explorers": [
    {
      "name": "DOScan",
      "url": "https://doscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dos-chain"
} as const;