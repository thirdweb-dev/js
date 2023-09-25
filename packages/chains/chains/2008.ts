import type { Chain } from "../src/types";
export default {
  "chainId": 2008,
  "chain": "CloudWalk Testnet",
  "name": "CloudWalk Testnet",
  "rpc": [],
  "slug": "cloudwalk-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "CloudWalk Native Token",
    "symbol": "CWN",
    "decimals": 18
  },
  "infoURL": "https://cloudwalk.io",
  "shortName": "cloudwalk_testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "CloudWalk Testnet Explorer",
      "url": "https://explorer.testnet.cloudwalk.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;