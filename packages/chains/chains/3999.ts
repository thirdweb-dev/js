export default {
  "name": "YuanChain Mainnet",
  "chain": "YCC",
  "rpc": [
    "https://yuanchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.yuan.org/eth"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "YCC",
    "symbol": "YCC",
    "decimals": 18
  },
  "infoURL": "https://www.yuan.org",
  "shortName": "ycc",
  "chainId": 3999,
  "networkId": 3999,
  "icon": {
    "url": "ipfs://QmdbPhiB5W2gbHZGkYsN7i2VTKKP9casmAN2hRnpDaL9W4",
    "width": 96,
    "height": 96,
    "format": "png"
  },
  "explorers": [
    {
      "name": "YuanChain Explorer",
      "url": "https://mainnet.yuan.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "yuanchain"
} as const;