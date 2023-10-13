import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 110008,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/7",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Shard 7",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quarkchain-devnet-shard-7.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s7-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39907"
  ],
  "shortName": "qkc-d-s7",
  "slug": "quarkchain-devnet-shard-7",
  "testnet": false
} as const satisfies Chain;