export default {
  "name": "QuarkChain Devnet Shard 7",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-devnet-shard-7.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s7-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39907"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s7",
  "chainId": 110008,
  "networkId": 110008,
  "parent": {
    "chain": "eip155-110000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/7",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-devnet-shard-7"
} as const;