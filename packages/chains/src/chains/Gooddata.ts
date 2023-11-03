import type { Chain } from "../types";
export default {
  "chain": "GooD",
  "chainId": 33,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.goodata.org",
  "name": "GoodData Mainnet",
  "nativeCurrency": {
    "name": "GoodData Mainnet Ether",
    "symbol": "GooD",
    "decimals": 18
  },
  "networkId": 33,
  "rpc": [
    "https://gooddata.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://33.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.goodata.io"
  ],
  "shortName": "GooD",
  "slug": "gooddata",
  "testnet": false
} as const satisfies Chain;