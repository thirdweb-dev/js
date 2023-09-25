import type { Chain } from "../src/types";
export default {
  "chainId": 113,
  "chain": "Dehvo",
  "name": "Dehvo",
  "rpc": [
    "https://dehvo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.dehvo.com",
    "https://rpc.dehvo.com",
    "https://rpc1.dehvo.com",
    "https://rpc2.dehvo.com"
  ],
  "slug": "dehvo",
  "faucets": [
    "https://buy.dehvo.com"
  ],
  "nativeCurrency": {
    "name": "Dehvo",
    "symbol": "Deh",
    "decimals": 18
  },
  "infoURL": "https://dehvo.com",
  "shortName": "deh",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Dehvo Explorer",
      "url": "https://explorer.dehvo.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;