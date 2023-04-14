import type { Chain } from "../src/types";
export default {
  "name": "CloudWalk Mainnet",
  "chain": "CloudWalk Mainnet",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "CloudWalk Native Token",
    "symbol": "CWN",
    "decimals": 18
  },
  "infoURL": "https://cloudwalk.io",
  "shortName": "cloudwalk_mainnet",
  "chainId": 2009,
  "networkId": 2009,
  "explorers": [
    {
      "name": "CloudWalk Mainnet Explorer",
      "url": "https://explorer.mainnet.cloudwalk.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "cloudwalk"
} as const satisfies Chain;