import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 100001,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/0",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Shard 0",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 100001,
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  },
  "rpc": [
    "https://100001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s0-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39000"
  ],
  "shortName": "qkc-s0",
  "slug": "quarkchain-shard-0",
  "testnet": false
} as const satisfies Chain;