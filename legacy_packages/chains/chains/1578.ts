import type { Chain } from "../src/types";
export default {
  "chain": "StarCHAIN",
  "chainId": 1578,
  "explorers": [
    {
      "name": "StarCHAIN Explorer",
      "url": "https://starchainscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://www.starworksglobal.com",
  "name": "StarCHAIN",
  "nativeCurrency": {
    "name": "STARX",
    "symbol": "STARX",
    "decimals": 18
  },
  "networkId": 1578,
  "rpc": [
    "https://1578.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.starworksglobal.com"
  ],
  "shortName": "starchain",
  "slug": "starchain",
  "testnet": false
} as const satisfies Chain;