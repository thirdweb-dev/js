export default {
  "name": "Newton",
  "chain": "NEW",
  "rpc": [
    "https://newton.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://global.rpc.mainnet.newtonproject.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Newton",
    "symbol": "NEW",
    "decimals": 18
  },
  "infoURL": "https://www.newtonproject.org/",
  "shortName": "new",
  "chainId": 1012,
  "networkId": 1012,
  "testnet": false,
  "slug": "newton"
} as const;