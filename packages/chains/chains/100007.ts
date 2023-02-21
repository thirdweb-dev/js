export default {
  "name": "QuarkChain Mainnet Shard 6",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-shard-6.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s6-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39006"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s6",
  "chainId": 100007,
  "networkId": 100007,
  "parent": {
    "chain": "eip155-100000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/6",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-shard-6"
} as const;