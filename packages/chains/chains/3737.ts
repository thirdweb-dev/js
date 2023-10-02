import type { Chain } from "../src/types";
export default {
  "chain": "Crossbell",
  "chainId": 3737,
  "explorers": [
    {
      "name": "Crossbell Explorer",
      "url": "https://scan.crossbell.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.crossbell.io"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmS8zEetTb6pwdNpVjv5bz55BXiSMGP9BjTJmNcjcUT91t",
    "width": 408,
    "height": 408,
    "format": "svg"
  },
  "infoURL": "https://crossbell.io",
  "name": "Crossbell",
  "nativeCurrency": {
    "name": "Crossbell Token",
    "symbol": "CSB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://crossbell.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.crossbell.io"
  ],
  "shortName": "csb",
  "slug": "crossbell",
  "testnet": false
} as const satisfies Chain;