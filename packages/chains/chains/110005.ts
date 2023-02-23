export default {
  "name": "QuarkChain Devnet Shard 4",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-devnet-shard-4.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s4-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39904"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s4",
  "chainId": 110005,
  "networkId": 110005,
  "parent": {
    "chain": "eip155-110000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/4",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-devnet-shard-4"
} as const;