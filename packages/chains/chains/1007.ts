export default {
  "name": "Newton Testnet",
  "chain": "NEW",
  "rpc": [
    "https://newton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.newchain.newtonproject.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Newton",
    "symbol": "NEW",
    "decimals": 18
  },
  "infoURL": "https://www.newtonproject.org/",
  "shortName": "tnew",
  "chainId": 1007,
  "networkId": 1007,
  "testnet": true,
  "slug": "newton-testnet"
} as const;