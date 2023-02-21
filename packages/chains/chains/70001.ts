export default {
  "name": "Thinkium Mainnet Chain 1",
  "chain": "Thinkium",
  "rpc": [
    "https://thinkium-chain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy1.thinkiumrpc.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM1",
  "chainId": 70001,
  "networkId": 70001,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain1.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "thinkium-chain-1"
} as const;