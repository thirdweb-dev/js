import type { Chain } from "../src/types";
export default {
  "chainId": 100003,
  "chain": "QuarkChain",
  "name": "QuarkChain Mainnet Shard 2",
  "rpc": [
    "https://quarkchain-shard-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s2-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39002"
  ],
  "slug": "quarkchain-shard-2",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s2",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/2",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;