import type { Chain } from "../src/types";
export default {
  "chain": "StarCHAIN",
  "chainId": 1570,
  "explorers": [
    {
      "name": "StarCHAIN Explorer",
      "url": "https://testnet.starchainscan.io",
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
  "name": "StarCHAIN Testnet",
  "nativeCurrency": {
    "name": "STARX",
    "symbol": "STARX",
    "decimals": 18
  },
  "networkId": 1570,
  "rpc": [
    "https://1570.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc1.starworksglobal.com"
  ],
  "shortName": "starchain-testnet",
  "slug": "starchain-testnet",
  "testnet": true
} as const satisfies Chain;