export default {
  "name": "Thinkium Mainnet Chain 103",
  "chain": "Thinkium",
  "rpc": [
    "https://thinkium-chain-103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy103.thinkiumrpc.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM103",
  "chainId": 70103,
  "networkId": 70103,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain103.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "thinkium-chain-103"
} as const;