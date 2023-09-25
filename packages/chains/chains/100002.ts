import type { Chain } from "../src/types";
export default {
  "chainId": 100002,
  "chain": "QuarkChain",
  "name": "QuarkChain Mainnet Shard 1",
  "rpc": [
    "https://quarkchain-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s1-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39001"
  ],
  "slug": "quarkchain-shard-1",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s1",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/1",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;