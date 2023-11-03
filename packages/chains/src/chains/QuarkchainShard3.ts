import type { Chain } from "../types";
export default {
  "chain": "QuarkChain",
  "chainId": 100004,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/3",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Shard 3",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 100004,
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  },
  "rpc": [
    "https://quarkchain-shard-3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://100004.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s3-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39003"
  ],
  "shortName": "qkc-s3",
  "slug": "quarkchain-shard-3",
  "testnet": false
} as const satisfies Chain;