import type { Chain } from "../src/types";
export default {
  "chain": "QuarkChain",
  "chainId": 110000,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.quarkchain.io",
  "name": "QuarkChain Devnet Root",
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "networkId": 110000,
  "rpc": [
    "https://quarkchain-devnet-root.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://110000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://jrpc.devnet.quarkchain.io:38391"
  ],
  "shortName": "qkc-d-r",
  "slug": "quarkchain-devnet-root",
  "testnet": false
} as const satisfies Chain;