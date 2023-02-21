export default {
  "name": "QuarkChain Mainnet Root",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-root.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://jrpc.mainnet.quarkchain.io:38391"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-r",
  "chainId": 100000,
  "networkId": 100000,
  "testnet": false,
  "slug": "quarkchain-root"
} as const;