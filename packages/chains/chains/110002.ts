import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 110002,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/1",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Shard 1",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quarkchain-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s1-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39901"
  ],
  "shortName": "qkc-d-s1",
  "slug": "quarkchain-devnet-shard-1",
  "testnet": false
} as const satisfies Chain;