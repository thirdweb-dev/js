import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 100007,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/6",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Shard 6",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quarkchain-shard-6.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s6-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39006"
  ],
  "shortName": "qkc-s6",
  "slug": "quarkchain-shard-6",
  "testnet": false
} as const satisfies Chain;