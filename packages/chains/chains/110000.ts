import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 110000,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Root",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quarkchain-devnet-root.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://jrpc.devnet.quarkchain.io:38391"
  ],
  "shortName": "qkc-d-r",
  "slug": "quarkchain-devnet-root",
  "testnet": false
} as const satisfies Chain;