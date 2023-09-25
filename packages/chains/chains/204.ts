import type { Chain } from "../src/types";
export default {
  "chainId": 204,
  "chain": "opBNB",
  "name": "opBNB Mainnet",
  "rpc": [
    "https://opbnb.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://opbnb-mainnet-rpc.bnbchain.org"
  ],
  "slug": "opbnb",
  "faucets": [],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://opbnb.bnbchain.org/en",
  "shortName": "obnb",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "opbnbscan",
      "url": "http://mainnet.opbnbscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;