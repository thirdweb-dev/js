import type { Chain } from "../src/types";
export default {
  "chain": "PEP",
  "chainId": 13371337,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://pepchain.io",
  "name": "PepChain Churchill",
  "nativeCurrency": {
    "name": "PepChain Churchill Ether",
    "symbol": "TPEP",
    "decimals": 18
  },
  "networkId": 13371337,
  "rpc": [
    "https://pepchain-churchill.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://13371337.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://churchill-rpc.pepchain.io"
  ],
  "shortName": "tpep",
  "slug": "pepchain-churchill",
  "testnet": false
} as const satisfies Chain;