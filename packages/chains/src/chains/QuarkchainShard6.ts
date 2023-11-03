import type { Chain } from "../types";
export default {
  "chain": "QuarkChain",
  "chainId": 100007,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/6",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Shard 6",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 100007,
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  },
  "rpc": [
    "https://quarkchain-shard-6.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://100007.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s6-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39006"
  ],
  "shortName": "qkc-s6",
  "slug": "quarkchain-shard-6",
  "testnet": false
} as const satisfies Chain;