import type { Chain } from "../src/types";
export default {
  "chainId": 3737,
  "chain": "Crossbell",
  "name": "Crossbell",
  "rpc": [
    "https://crossbell.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.crossbell.io"
  ],
  "slug": "crossbell",
  "icon": {
    "url": "ipfs://QmS8zEetTb6pwdNpVjv5bz55BXiSMGP9BjTJmNcjcUT91t",
    "width": 408,
    "height": 408,
    "format": "svg"
  },
  "faucets": [
    "https://faucet.crossbell.io"
  ],
  "nativeCurrency": {
    "name": "Crossbell Token",
    "symbol": "CSB",
    "decimals": 18
  },
  "infoURL": "https://crossbell.io",
  "shortName": "csb",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Crossbell Explorer",
      "url": "https://scan.crossbell.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;