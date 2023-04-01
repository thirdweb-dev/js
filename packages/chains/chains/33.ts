import type { Chain } from "../src/types";
export default {
  "name": "GoodData Mainnet",
  "chain": "GooD",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "GoodData Mainnet Ether",
    "symbol": "GooD",
    "decimals": 18
  },
  "infoURL": "https://www.goodata.org",
  "shortName": "GooD",
  "chainId": 33,
  "networkId": 33,
  "testnet": false,
  "slug": "gooddata"
} as const satisfies Chain;