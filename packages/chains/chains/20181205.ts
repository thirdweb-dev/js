export default {
  "name": "quarkblockchain",
  "chain": "QKI",
  "rpc": [
    "https://quarkblockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hz.rpc.qkiscan.cn",
    "https://jp.rpc.qkiscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "quarkblockchain Native Token",
    "symbol": "QKI",
    "decimals": 18
  },
  "infoURL": "https://quarkblockchain.org/",
  "shortName": "qki",
  "chainId": 20181205,
  "networkId": 20181205,
  "testnet": false,
  "slug": "quarkblockchain"
} as const;