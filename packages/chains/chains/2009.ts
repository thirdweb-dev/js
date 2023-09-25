import type { Chain } from "../src/types";
export default {
  "chainId": 2009,
  "chain": "CloudWalk Mainnet",
  "name": "CloudWalk Mainnet",
  "rpc": [],
  "slug": "cloudwalk",
  "faucets": [],
  "nativeCurrency": {
    "name": "CloudWalk Native Token",
    "symbol": "CWN",
    "decimals": 18
  },
  "infoURL": "https://cloudwalk.io",
  "shortName": "cloudwalk_mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "CloudWalk Mainnet Explorer",
      "url": "https://explorer.mainnet.cloudwalk.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;