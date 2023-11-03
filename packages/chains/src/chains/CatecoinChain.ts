import type { Chain } from "../types";
export default {
  "chain": "Catechain",
  "chainId": 1618,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://catechain.com",
  "name": "Catecoin Chain Mainnet",
  "nativeCurrency": {
    "name": "Catecoin",
    "symbol": "CATE",
    "decimals": 18
  },
  "networkId": 1618,
  "rpc": [
    "https://catecoin-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1618.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://send.catechain.com"
  ],
  "shortName": "cate",
  "slug": "catecoin-chain",
  "testnet": false
} as const satisfies Chain;