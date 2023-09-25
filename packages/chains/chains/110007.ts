import type { Chain } from "../src/types";
export default {
  "chainId": 110007,
  "chain": "QuarkChain",
  "name": "QuarkChain Devnet Shard 6",
  "rpc": [
    "https://quarkchain-devnet-shard-6.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s6-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39906"
  ],
  "slug": "quarkchain-devnet-shard-6",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s6",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/6",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;