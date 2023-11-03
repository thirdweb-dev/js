import type { Chain } from "../types";
export default {
  "chain": "QuarkChain",
  "chainId": 110003,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/2",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Shard 2",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 110003,
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  },
  "rpc": [
    "https://quarkchain-devnet-shard-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://110003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet-s2-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39902"
  ],
  "shortName": "qkc-d-s2",
  "slug": "quarkchain-devnet-shard-2",
  "testnet": false
} as const satisfies Chain;