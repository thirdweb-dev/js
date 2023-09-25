import type { Chain } from "../src/types";
export default {
  "chainId": 700,
  "chain": "SNS",
  "name": "Star Social Testnet",
  "rpc": [
    "https://star-social-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avastar.cc/ext/bc/C/rpc"
  ],
  "slug": "star-social-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Social",
    "symbol": "SNS",
    "decimals": 18
  },
  "infoURL": "https://info.avastar.cc",
  "shortName": "SNS",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "starscan",
      "url": "https://avastar.info",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;