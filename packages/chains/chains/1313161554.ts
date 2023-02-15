export default {
  "name": "Aurora Mainnet",
  "chain": "NEAR",
  "rpc": [
    "https://aurora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.aurora.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://aurora.dev",
  "shortName": "aurora",
  "chainId": 1313161554,
  "networkId": 1313161554,
  "explorers": [
    {
      "name": "aurorascan.dev",
      "url": "https://aurorascan.dev",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "aurora"
} as const;