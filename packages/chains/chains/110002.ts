export default {
  "name": "QuarkChain Devnet Shard 1",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s1-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39901"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s1",
  "chainId": 110002,
  "networkId": 110002,
  "parent": {
    "chain": "eip155-110000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/1",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-devnet-shard-1"
} as const;