import type { Chain } from "../src/types";
export default {
  "name": "QuarkChain Mainnet Shard 3",
  "chain": "QuarkChain",
  "rpc": [
    "https://quarkchain-shard-3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-s3-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39003"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-s3",
  "chainId": 100004,
  "networkId": 100004,
  "parent": {
    "chain": "eip155-100000",
    "type": "shard"
  },
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/3",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quarkchain-shard-3"
} as const satisfies Chain;