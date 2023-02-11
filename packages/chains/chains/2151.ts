export default {
  "name": "BOSagora Mainnet",
  "chain": "ETH",
  "rpc": [
    "https://bosagora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bosagora.org",
    "https://rpc.bosagora.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BOSAGORA",
    "symbol": "BOA",
    "decimals": 18
  },
  "infoURL": "https://docs.bosagora.org",
  "shortName": "boa",
  "chainId": 2151,
  "networkId": 2151,
  "icon": {
    "url": "ipfs://QmW3CT4SHmso5dRJdsjR8GL1qmt79HkdAebCn2uNaWXFYh",
    "width": 256,
    "height": 257,
    "format": "png"
  },
  "explorers": [
    {
      "name": "BOASCAN",
      "url": "https://boascan.io",
      "icon": "agora",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bosagora"
} as const;