import type { Chain } from "../types";
export default {
  "chain": "QuarkChain",
  "chainId": 110001,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/0",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Shard 0",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 110001,
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  },
  "rpc": [
    "https://quarkchain-devnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://110001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s0-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39900"
  ],
  "shortName": "qkc-d-s0",
  "slug": "quarkchain-devnet-shard-0",
  "testnet": false
} as const satisfies Chain;