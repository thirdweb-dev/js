import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 100011,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain L2 Mainnet",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 100011,
  "parent": {
    "type": "L2",
    "chain": "eip155-100000"
  },
  "rpc": [
    "https://100011.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-l2-ethapi.quarkchain.io"
  ],
  "shortName": "qkc-l2",
  "slug": "quarkchain-l2",
  "testnet": false
} as const satisfies Chain;