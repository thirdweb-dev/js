export default {
  "name": "Catecoin Chain Mainnet",
  "chain": "Catechain",
  "rpc": [
    "https://catecoin-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://send.catechain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Catecoin",
    "symbol": "CATE",
    "decimals": 18
  },
  "infoURL": "https://catechain.com",
  "shortName": "cate",
  "chainId": 1618,
  "networkId": 1618,
  "testnet": false,
  "slug": "catecoin-chain"
} as const;