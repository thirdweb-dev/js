export default {
  "name": "QuarkChain Mainnet Shard 4",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-shard-4.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s4-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39004"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s4",
  "chainId": 100005,
  "networkId": 100005,
  "parent": {
    "chain": "eip155-100000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/4",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-shard-4"
} as const;