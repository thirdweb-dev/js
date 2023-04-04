import type { Chain } from "../src/types";
export default {
  "name": "CloudWalk Testnet",
  "chain": "CloudWalk Testnet",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "CloudWalk Native Token",
    "symbol": "CWN",
    "decimals": 18
  },
  "infoURL": "https://cloudwalk.io",
  "shortName": "cloudwalk_testnet",
  "chainId": 2008,
  "networkId": 2008,
  "explorers": [
    {
      "name": "CloudWalk Testnet Explorer",
      "url": "https://explorer.testnet.cloudwalk.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "cloudwalk-testnet"
} as const satisfies Chain;