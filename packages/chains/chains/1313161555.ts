export default {
  "name": "Aurora Testnet",
  "chain": "NEAR",
  "rpc": [
    "https://aurora-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.aurora.dev/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://aurora.dev",
  "shortName": "aurora-testnet",
  "chainId": 1313161555,
  "networkId": 1313161555,
  "explorers": [
    {
      "name": "aurorascan.dev",
      "url": "https://testnet.aurorascan.dev",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "aurora-testnet"
} as const;