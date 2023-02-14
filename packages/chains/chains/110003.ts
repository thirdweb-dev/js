export default {
  "name": "QuarkChain Devnet Shard 2",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-devnet-shard-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s2-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39902"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s2",
  "chainId": 110003,
  "networkId": 110003,
  "parent": {
    "chain": "eip155-110000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/2",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-devnet-shard-2"
} as const;