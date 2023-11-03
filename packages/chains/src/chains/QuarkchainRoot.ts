import type { Chain } from "../types";
export default {
  "chain": "QuarkChain",
  "chainId": 100000,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Mainnet Root",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 100000,
  "rpc": [
    "https://quarkchain-root.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://100000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://jrpc.mainnet.quarkchain.io:38391"
  ],
  "shortName": "qkc-r",
  "slug": "quarkchain-root",
  "testnet": false
} as const satisfies Chain;