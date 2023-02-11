export default {
  "name": "QuarkChain Mainnet Shard 7",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-shard-7.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s7-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39007"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s7",
  "chainId": 100008,
  "networkId": 100008,
  "parent": {
    "chain": "eip155-100000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/7",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-shard-7"
} as const;