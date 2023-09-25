import type { Chain } from "../src/types";
export default {
  "chainId": 100007,
  "chain": "QuarkChain",
  "name": "QuarkChain Mainnet Shard 6",
  "rpc": [
    "https://quarkchain-shard-6.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s6-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39006"
  ],
  "slug": "quarkchain-shard-6",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s6",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/6",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;