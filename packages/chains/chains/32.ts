import type { Chain } from "../src/types";
export default {
  "chainId": 32,
  "chain": "GooD",
  "name": "GoodData Testnet",
  "rpc": [
    "https://gooddata-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test2.goodata.io"
  ],
  "slug": "gooddata-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "GoodData Testnet Ether",
    "symbol": "GooD",
    "decimals": 18
  },
  "infoURL": "https://www.goodata.org",
  "shortName": "GooDT",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;