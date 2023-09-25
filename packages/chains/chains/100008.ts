import type { Chain } from "../src/types";
export default {
  "chainId": 100008,
  "chain": "QuarkChain",
  "name": "QuarkChain Mainnet Shard 7",
  "rpc": [
    "https://quarkchain-shard-7.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s7-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39007"
  ],
  "slug": "quarkchain-shard-7",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s7",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/7",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;