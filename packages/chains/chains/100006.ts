import type { Chain } from "../src/types";
export default {
  "chainId": 100006,
  "chain": "QuarkChain",
  "name": "QuarkChain Mainnet Shard 5",
  "rpc": [
    "https://quarkchain-shard-5.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s5-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39005"
  ],
  "slug": "quarkchain-shard-5",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s5",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/5",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;