import type { Chain } from "../src/types";
export default {
  "name": "PepChain Churchill",
  "chain": "PEP",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "PepChain Churchill Ether",
    "symbol": "TPEP",
    "decimals": 18
  },
  "infoURL": "https://pepchain.io",
  "shortName": "tpep",
  "chainId": 13371337,
  "networkId": 13371337,
  "testnet": false,
  "slug": "pepchain-churchill"
} as const satisfies Chain;