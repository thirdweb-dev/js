export default {
  "name": "QuarkChain Devnet Shard 6",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-devnet-shard-6.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s6-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39906"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s6",
  "chainId": 110007,
  "networkId": 110007,
  "parent": {
    "chain": "eip155-110000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/6",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-devnet-shard-6"
} as const;