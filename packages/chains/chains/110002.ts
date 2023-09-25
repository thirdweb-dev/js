import type { Chain } from "../src/types";
export default {
  "chainId": 110002,
  "chain": "QuarkChain",
  "name": "QuarkChain Devnet Shard 1",
  "rpc": [
    "https://quarkchain-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s1-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39901"
  ],
  "slug": "quarkchain-devnet-shard-1",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s1",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/1",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;