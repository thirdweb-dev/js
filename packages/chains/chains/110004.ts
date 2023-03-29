export default {
  "name": "QuarkChain Devnet Shard 3",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-devnet-shard-3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s3-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39903"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s3",
  "chainId": 110004,
  "networkId": 110004,
  "parent": {
    "chain": "eip155-110000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/3",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-devnet-shard-3"
} as const;