export default {
  "name": "Star Social Testnet",
  "chain": "SNS",
  "rpc": [
    "https://star-social-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avastar.cc/ext/bc/C/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Social",
    "symbol": "SNS",
    "decimals": 18
  },
  "infoURL": "https://info.avastar.cc",
  "shortName": "SNS",
  "chainId": 700,
  "networkId": 700,
  "explorers": [
    {
      "name": "starscan",
      "url": "https://avastar.info",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "star-social-testnet"
} as const;