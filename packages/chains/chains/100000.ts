import type { Chain } from "../src/types";
export default {
  "chainId": 100000,
  "chain": "QuarkChain",
  "name": "QuarkChain Mainnet Root",
  "rpc": [
    "https://quarkchain-root.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://jrpc.mainnet.quarkchain.io:38391"
  ],
  "slug": "quarkchain-root",
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "shortName": "qkc-r",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;