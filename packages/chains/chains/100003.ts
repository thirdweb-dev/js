export default {
  "name": "QuarkChain Mainnet Shard 2",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-shard-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s2-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39002"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s2",
  "chainId": 100003,
  "networkId": 100003,
  "parent": {
    "chain": "eip155-100000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/2",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-shard-2"
} as const;