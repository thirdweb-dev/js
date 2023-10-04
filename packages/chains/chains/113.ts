import type { Chain } from "../src/types";
export default {
  "chain": "Dehvo",
  "chainId": 113,
  "explorers": [
    {
      "name": "Dehvo Explorer",
      "url": "https://explorer.dehvo.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://buy.dehvo.com"
  ],
  "features": [],
  "infoURL": "https://dehvo.com",
  "name": "Dehvo",
  "nativeCurrency": {
    "name": "Dehvo",
    "symbol": "Deh",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dehvo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.dehvo.com",
    "https://rpc.dehvo.com",
    "https://rpc1.dehvo.com",
    "https://rpc2.dehvo.com"
  ],
  "shortName": "deh",
  "slug": "dehvo",
  "testnet": false
} as const satisfies Chain;