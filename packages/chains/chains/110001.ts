export default {
  "name": "QuarkChain Devnet Shard 0",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-devnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s0-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39900"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s0",
  "chainId": 110001,
  "networkId": 110001,
  "parent": {
    "chain": "eip155-110000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/0",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-devnet-shard-0"
} as const;