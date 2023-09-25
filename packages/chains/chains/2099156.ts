import type { Chain } from "../src/types";
export default {
  "chainId": 2099156,
  "chain": "Plian",
  "name": "Plian Mainnet Main",
  "rpc": [
    "https://plian-main.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.plian.io/pchain"
  ],
  "slug": "plian-main",
  "faucets": [],
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "PI",
    "decimals": 18
  },
  "infoURL": "https://plian.org/",
  "shortName": "plian-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "piscan",
      "url": "https://piscan.plian.org/pchain",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;