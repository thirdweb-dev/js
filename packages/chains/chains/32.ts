import type { Chain } from "../src/types";
export default {
  "chain": "GooD",
  "chainId": 32,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.goodata.org",
  "name": "GoodData Testnet",
  "nativeCurrency": {
    "name": "GoodData Testnet Ether",
    "symbol": "GooD",
    "decimals": 18
  },
  "networkId": 32,
  "rpc": [
    "https://gooddata-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://32.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test2.goodata.io"
  ],
  "shortName": "GooDT",
  "slug": "gooddata-testnet",
  "testnet": true
} as const satisfies Chain;