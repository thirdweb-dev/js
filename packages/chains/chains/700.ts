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
  "infoURL": "https://info.avastar.cc",
  "name": "Star Social Testnet",
  "nativeCurrency": {
    "name": "Social",
    "symbol": "SNS",
    "decimals": 18
  },
  "networkId": 700,
  "rpc": [
    "https://700.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avastar.cc/ext/bc/C/rpc"
  ],
  "shortName": "SNS",
  "slip44": 1,
  "slug": "star-social-testnet",
  "testnet": true
} as const satisfies Chain;