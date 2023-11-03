import type { Chain } from "../types";
export default {
  "chain": "QuarkChain",
  "chainId": 110002,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/1",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Shard 1",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 110002,
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  },
  "rpc": [
    "https://quarkchain-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://110002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s1-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39901"
  ],
  "shortName": "qkc-d-s1",
  "slug": "quarkchain-devnet-shard-1",
  "testnet": false
} as const satisfies Chain;