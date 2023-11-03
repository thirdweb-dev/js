import type { Chain } from "../types";
export default {
  "chain": "QuarkChain",
  "chainId": 100002,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/1",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Shard 1",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 100002,
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  },
  "rpc": [
    "https://quarkchain-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://100002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s1-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39001"
  ],
  "shortName": "qkc-s1",
  "slug": "quarkchain-shard-1",
  "testnet": false
} as const satisfies Chain;