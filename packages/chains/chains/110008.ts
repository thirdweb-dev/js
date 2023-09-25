import type { Chain } from "../src/types";
export default {
  "chainId": 110008,
  "chain": "QuarkChain",
  "name": "QuarkChain Devnet Shard 7",
  "rpc": [
    "https://quarkchain-devnet-shard-7.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s7-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39907"
  ],
  "slug": "quarkchain-devnet-shard-7",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s7",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/7",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;