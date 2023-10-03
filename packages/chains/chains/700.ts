import type { Chain } from "../src/types";
export default {
  "chain": "SNS",
  "chainId": 700,
  "explorers": [
    {
      "name": "starscan",
      "url": "https://avastar.info",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://info.avastar.cc",
  "name": "Star Social Testnet",
  "nativeCurrency": {
    "name": "Social",
    "symbol": "SNS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://star-social-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avastar.cc/ext/bc/C/rpc"
  ],
  "shortName": "SNS",
  "slug": "star-social-testnet",
  "testnet": true
} as const satisfies Chain;