import type { Chain } from "../src/types";
export default {
  "name": "Catecoin Chain Mainnet",
  "chain": "Catechain",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Catecoin",
    "symbol": "CATE",
    "decimals": 18
  },
  "infoURL": "https://catechain.com",
  "shortName": "cate",
  "chainId": 1618,
  "networkId": 1618,
  "testnet": false,
  "slug": "catecoin-chain"
} as const satisfies Chain;