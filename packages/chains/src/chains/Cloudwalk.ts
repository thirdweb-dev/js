import type { Chain } from "../types";
export default {
  "chain": "CloudWalk Mainnet",
  "chainId": 2009,
  "explorers": [
    {
      "name": "CloudWalk Mainnet Explorer",
      "url": "https://explorer.mainnet.cloudwalk.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://cloudwalk.io",
  "name": "CloudWalk Mainnet",
  "nativeCurrency": {
    "name": "CloudWalk Native Token",
    "symbol": "CWN",
    "decimals": 18
  },
  "networkId": 2009,
  "rpc": [],
  "shortName": "cloudwalk_mainnet",
  "slug": "cloudwalk",
  "testnet": false
} as const satisfies Chain;