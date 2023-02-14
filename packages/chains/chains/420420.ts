export default {
  "name": "Kekchain",
  "chain": "kek",
  "rpc": [
    "https://kekchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.kekchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KEK",
    "symbol": "KEK",
    "decimals": 18
  },
  "infoURL": "https://kekchain.com",
  "shortName": "KEK",
  "chainId": 420420,
  "networkId": 103090,
  "icon": {
    "url": "ipfs://QmNzwHAmaaQyuvKudrzGkrTT2GMshcmCmJ9FH8gG2mNJtM",
    "width": 401,
    "height": 401,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://mainnet-explorer.kekchain.com",
      "icon": "kek",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "kekchain"
} as const;