import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 110006,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/5",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Shard 5",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quarkchain-devnet-shard-5.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s5-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39905"
  ],
  "shortName": "qkc-d-s5",
  "slug": "quarkchain-devnet-shard-5",
  "testnet": false
} as const satisfies Chain;