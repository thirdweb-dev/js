import type { Chain } from "../src/types";
export default {
  "chainId": 110006,
  "chain": "QuarkChain",
  "name": "QuarkChain Devnet Shard 5",
  "rpc": [
    "https://quarkchain-devnet-shard-5.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s5-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39905"
  ],
  "slug": "quarkchain-devnet-shard-5",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s5",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/5",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;