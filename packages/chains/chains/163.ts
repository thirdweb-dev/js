export default {
  "name": "Lightstreams Mainnet",
  "chain": "PHT",
  "rpc": [
    "https://lightstreams.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.mainnet.lightstreams.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Lightstreams PHT",
    "symbol": "PHT",
    "decimals": 18
  },
  "infoURL": "https://explorer.lightstreams.io",
  "shortName": "pht",
  "chainId": 163,
  "networkId": 163,
  "testnet": false,
  "slug": "lightstreams"
} as const;