export default {
  "name": "DAX CHAIN",
  "chain": "DAX",
  "rpc": [
    "https://dax-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.prodax.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Prodax",
    "symbol": "DAX",
    "decimals": 18
  },
  "infoURL": "https://prodax.io/",
  "shortName": "dax",
  "chainId": 142,
  "networkId": 142,
  "testnet": false,
  "slug": "dax-chain"
} as const;