import type { Chain } from "../types";
export default {
  "chain": "QuarkChain",
  "chainId": 100006,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/5",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Shard 5",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 100006,
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  },
  "rpc": [
    "https://quarkchain-shard-5.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://100006.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s5-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39005"
  ],
  "shortName": "qkc-s5",
  "slug": "quarkchain-shard-5",
  "testnet": false
} as const satisfies Chain;