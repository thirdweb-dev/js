import type { Chain } from "../src/types";
export default {
  "chain": "Plian",
  "chainId": 2099156,
  "explorers": [
    {
      "name": "piscan",
      "url": "https://piscan.plian.org/pchain",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://plian.org/",
  "name": "Plian Mainnet Main",
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "PI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://plian-main.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.plian.io/pchain"
  ],
  "shortName": "plian-mainnet",
  "slug": "plian-main",
  "testnet": false
} as const satisfies Chain;