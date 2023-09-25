import type { Chain } from "../src/types";
export default {
  "chainId": 13371337,
  "chain": "PEP",
  "name": "PepChain Churchill",
  "rpc": [
    "https://pepchain-churchill.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://churchill-rpc.pepchain.io"
  ],
  "slug": "pepchain-churchill",
  "faucets": [],
  "nativeCurrency": {
    "name": "PepChain Churchill Ether",
    "symbol": "TPEP",
    "decimals": 18
  },
  "infoURL": "https://pepchain.io",
  "shortName": "tpep",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;