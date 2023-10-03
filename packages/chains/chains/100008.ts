import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 100008,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/7",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Shard 7",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quarkchain-shard-7.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s7-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39007"
  ],
  "shortName": "qkc-s7",
  "slug": "quarkchain-shard-7",
  "testnet": false
} as const satisfies Chain;