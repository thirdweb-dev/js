export default {
  "name": "QuarkChain Devnet Shard 5",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-devnet-shard-5.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s5-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39905"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s5",
  "chainId": 110006,
  "networkId": 110006,
  "parent": {
    "chain": "eip155-110000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/5",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-devnet-shard-5"
} as const;