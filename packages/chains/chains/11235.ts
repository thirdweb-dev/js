export default {
  "name": "Haqq Network",
  "chain": "Haqq",
  "rpc": [
    "https://haqq-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eth.haqq.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Islamic Coin",
    "symbol": "ISLM",
    "decimals": 18
  },
  "infoURL": "https://islamiccoin.net",
  "shortName": "ISLM",
  "chainId": 11235,
  "networkId": 11235,
  "explorers": [
    {
      "name": "Mainnet HAQQ Explorer",
      "url": "https://explorer.haqq.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "haqq-network"
} as const;