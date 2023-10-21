import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 100003,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/2",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Shard 2",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quarkchain-shard-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s2-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39002"
  ],
  "shortName": "qkc-s2",
  "slug": "quarkchain-shard-2",
  "testnet": false
} as const satisfies Chain;