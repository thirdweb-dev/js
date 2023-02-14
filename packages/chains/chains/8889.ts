export default {
  "name": "Vyvo Smart Chain",
  "chain": "VSC",
  "rpc": [
    "https://vyvo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vsc-dataseed.vyvo.org:8889"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "VSC",
    "symbol": "VSC",
    "decimals": 18
  },
  "infoURL": "https://vsc-dataseed.vyvo.org",
  "shortName": "vsc",
  "chainId": 8889,
  "networkId": 8889,
  "testnet": false,
  "slug": "vyvo-smart-chain"
} as const;