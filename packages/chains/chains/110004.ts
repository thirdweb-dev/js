import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 110004,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/3",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Shard 3",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 110004,
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  },
  "rpc": [
    "https://110004.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s3-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39903"
  ],
  "shortName": "qkc-d-s3",
  "slug": "quarkchain-devnet-shard-3",
  "testnet": false
} as const satisfies Chain;