import type { Chain } from "../types";
export default {
  "chain": "QuarkChain",
  "chainId": 110007,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/6",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Shard 6",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 110007,
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  },
  "rpc": [
    "https://quarkchain-devnet-shard-6.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://110007.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s6-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39906"
  ],
  "shortName": "qkc-d-s6",
  "slug": "quarkchain-devnet-shard-6",
  "testnet": false
} as const satisfies Chain;