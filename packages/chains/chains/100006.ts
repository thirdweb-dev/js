import type { Chain } from "../src/types";
export default {
  "name": "QuarkChain Mainnet Shard 5",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-shard-5.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s5-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39005"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s5",
  "chainId": 100006,
  "networkId": 100006,
  "parent": {
    "chain": "eip155-100000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/5",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-shard-5"
} as const satisfies Chain;