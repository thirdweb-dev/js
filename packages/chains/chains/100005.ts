import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 100005,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/4",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Shard 4",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 100005,
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  },
  "rpc": [
    "https://quarkchain-shard-4.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://100005.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s4-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39004"
  ],
  "shortName": "qkc-s4",
  "slug": "quarkchain-shard-4",
  "testnet": false
} as const satisfies Chain;