export default {
  "name": "AME Chain Mainnet",
  "chain": "AME",
  "rpc": [
    "https://ame-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.amechain.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AME",
    "symbol": "AME",
    "decimals": 18
  },
  "infoURL": "https://amechain.io/",
  "shortName": "ame",
  "chainId": 180,
  "networkId": 180,
  "explorers": [
    {
      "name": "AME Scan",
      "url": "https://amescan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ame-chain"
} as const;