import type { Chain } from "../src/types";
export default {
  "chain": "GooD",
  "chainId": 32,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.goodata.org",
  "name": "GoodData Testnet",
  "nativeCurrency": {
    "name": "GoodData Testnet Ether",
    "symbol": "GooD",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://gooddata-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test2.goodata.io"
  ],
  "shortName": "GooDT",
  "slug": "gooddata-testnet",
  "testnet": true
} as const satisfies Chain;