import type { Chain } from "../src/types";
export default {
  "chainId": 110004,
  "chain": "QuarkChain",
  "name": "QuarkChain Devnet Shard 3",
  "rpc": [
    "https://quarkchain-devnet-shard-3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s3-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39903"
  ],
  "slug": "quarkchain-devnet-shard-3",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s3",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/3",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;