import type { Chain } from "../src/types";
export default {
  "chain": "CloudWalk Testnet",
  "chainId": 2008,
  "explorers": [
    {
      "name": "CloudWalk Testnet Explorer",
      "url": "https://explorer.testnet.cloudwalk.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://cloudwalk.io",
  "name": "CloudWalk Testnet",
  "nativeCurrency": {
    "name": "CloudWalk Native Token",
    "symbol": "CWN",
    "decimals": 18
  },
  "networkId": 2008,
  "rpc": [],
  "shortName": "cloudwalk_testnet",
  "slip44": 1,
  "slug": "cloudwalk-testnet",
  "testnet": true
} as const satisfies Chain;