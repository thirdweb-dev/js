export default {
  "name": "Thinkium Mainnet Chain 2",
  "chain": "Thinkium",
  "rpc": [
    "https://thinkium-chain-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy2.thinkiumrpc.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM2",
  "chainId": 70002,
  "networkId": 70002,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain2.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "thinkium-chain-2"
} as const;