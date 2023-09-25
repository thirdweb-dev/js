import type { Chain } from "../src/types";
export default {
  "chainId": 100005,
  "chain": "QuarkChain",
  "name": "QuarkChain Mainnet Shard 4",
  "rpc": [
    "https://quarkchain-shard-4.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s4-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39004"
  ],
  "slug": "quarkchain-shard-4",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s4",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/4",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;