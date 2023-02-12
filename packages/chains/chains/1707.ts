export default {
  "name": "TBSI Mainnet",
  "title": "Thai Blockchain Service Infrastructure Mainnet",
  "chain": "TBSI",
  "rpc": [
    "https://tbsi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blockchain.or.th"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Jinda",
    "symbol": "JINDA",
    "decimals": 18
  },
  "infoURL": "https://blockchain.or.th",
  "shortName": "TBSI",
  "chainId": 1707,
  "networkId": 1707,
  "testnet": false,
  "slug": "tbsi"
} as const;