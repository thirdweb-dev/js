export default {
  "name": "QuarkChain Devnet Root",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-devnet-root.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://jrpc.devnet.quarkchain.io:38391"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-r",
  "chainId": 110000,
  "networkId": 110000,
  "testnet": false,
  "slug": "quarkchain-devnet-root"
} as const;