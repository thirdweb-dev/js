import type { Chain } from "../src/types";
export default {
  "chainId": 110000,
  "chain": "QuarkChain",
  "name": "QuarkChain Devnet Root",
  "rpc": [
    "https://quarkchain-devnet-root.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://jrpc.devnet.quarkchain.io:38391"
  ],
  "slug": "quarkchain-devnet-root",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-d-r",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;