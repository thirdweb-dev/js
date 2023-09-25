import type { Chain } from "../src/types";
export default {
  "chainId": 110003,
  "chain": "QuarkChain",
  "name": "QuarkChain Devnet Shard 2",
  "rpc": [
    "https://quarkchain-devnet-shard-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s2-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39902"
  ],
  "slug": "quarkchain-devnet-shard-2",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s2",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/2",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;