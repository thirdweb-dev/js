import type { Chain } from "../src/types";
export default {
  "chainId": 110001,
  "chain": "QuarkChain",
  "name": "QuarkChain Devnet Shard 0",
  "rpc": [
    "https://quarkchain-devnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s0-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39900"
  ],
  "slug": "quarkchain-devnet-shard-0",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s0",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/0",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;