import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 110005,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/4",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Shard 4",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quarkchain-devnet-shard-4.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s4-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39904"
  ],
  "shortName": "qkc-d-s4",
  "slug": "quarkchain-devnet-shard-4",
  "testnet": false
} as const satisfies Chain;