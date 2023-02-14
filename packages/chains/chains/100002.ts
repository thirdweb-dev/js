export default {
  "name": "QuarkChain Mainnet Shard 1",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s1-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39001"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s1",
  "chainId": 100002,
  "networkId": 100002,
  "parent": {
    "chain": "eip155-100000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/1",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-shard-1"
} as const;