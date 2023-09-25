import type { Chain } from "../src/types";
export default {
  "chainId": 1618,
  "chain": "Catechain",
  "name": "Catecoin Chain Mainnet",
  "rpc": [
    "https://catecoin-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://send.catechain.com"
  ],
  "slug": "catecoin-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Catecoin",
    "symbol": "CATE",
    "decimals": 18
  },
  "infoURL": "https://catechain.com",
  "shortName": "cate",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;