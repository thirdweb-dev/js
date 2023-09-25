import type { Chain } from "../src/types";
export default {
  "chainId": 110005,
  "chain": "QuarkChain",
  "name": "QuarkChain Devnet Shard 4",
  "rpc": [
    "https://quarkchain-devnet-shard-4.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s4-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39904"
  ],
  "slug": "quarkchain-devnet-shard-4",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-s4",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/4",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;