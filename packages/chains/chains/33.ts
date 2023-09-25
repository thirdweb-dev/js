import type { Chain } from "../src/types";
export default {
  "chainId": 33,
  "chain": "GooD",
  "name": "GoodData Mainnet",
  "rpc": [
    "https://gooddata.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.goodata.io"
  ],
  "slug": "gooddata",
  "faucets": [],
  "nativeCurrency": {
    "name": "GoodData Mainnet Ether",
    "symbol": "GooD",
    "decimals": 18
  },
  "infoURL": "https://www.goodata.org",
  "shortName": "GooD",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;