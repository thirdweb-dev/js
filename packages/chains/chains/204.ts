import type { Chain } from "../src/types";
export default {
  "chain": "opBNB",
  "chainId": 204,
  "explorers": [
    {
      "name": "opbnbscan",
      "url": "http://mainnet.opbnbscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://opbnb.bnbchain.org/en",
  "name": "opBNB Mainnet",
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://opbnb.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://opbnb-mainnet-rpc.bnbchain.org",
    "https://opbnb.publicnode.com",
    "wss://opbnb.publicnode.com"
  ],
  "shortName": "obnb",
  "slug": "opbnb",
  "testnet": false
} as const satisfies Chain;