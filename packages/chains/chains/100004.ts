import type { Chain } from "../src/types";
export default {
  "chainId": 100004,
  "chain": "QuarkChain",
  "name": "QuarkChain Mainnet Shard 3",
  "rpc": [
    "https://quarkchain-shard-3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s3-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39003"
  ],
  "slug": "quarkchain-shard-3",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s3",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/3",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;