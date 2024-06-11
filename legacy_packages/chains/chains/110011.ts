import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 110011,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain L2 Testnet",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 110011,
  "parent": {
    "type": "L2",
    "chain": "eip155-110000"
  },
  "rpc": [
    "https://110011.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-l2-ethapi.quarkchain.io"
  ],
  "shortName": "qkc-l2-t",
  "slug": "quarkchain-l2-testnet",
  "testnet": true
} as const satisfies Chain;