import type { Chain } from "../src/types";
export default {
  "chainId": 100001,
  "chain": "QuarkChain",
  "name": "QuarkChain Mainnet Shard 0",
  "rpc": [
    "https://quarkchain-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s0-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39000"
  ],
  "slug": "quarkchain-shard-0",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s0",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/0",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;