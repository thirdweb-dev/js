export default {
  "name": "QuarkChain Mainnet Shard 0",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s0-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39000"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s0",
  "chainId": 100001,
  "networkId": 100001,
  "parent": {
    "chain": "eip155-100000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/0",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-shard-0"
} as const;