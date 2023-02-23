export default {
  "name": "Lightstreams Testnet",
  "chain": "PHT",
  "rpc": [
    "https://lightstreams-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.sirius.lightstreams.io"
  ],
  "faucets": [
    "https://discuss.lightstreams.network/t/request-test-tokens"
  ],
  "nativeCurrency": {
    "name": "Lightstreams PHT",
    "symbol": "PHT",
    "decimals": 18
  },
  "infoURL": "https://explorer.sirius.lightstreams.io",
  "shortName": "tpht",
  "chainId": 162,
  "networkId": 162,
  "testnet": true,
  "slug": "lightstreams-testnet"
} as const;