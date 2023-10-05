import type { Chain } from "../src/types";
export default {
  "chain": "Neonlink",
  "chainId": 259,
  "explorers": [
    {
      "name": "Neon Blockchain Explorer",
      "url": "https://scan.neonlink.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmX3hBv8WyvVfYjh1gmgDfJCpJBvKk4TYG9wFX9sC8WAjz",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://neonlink.io",
  "name": "Neonlink Mainnet",
  "nativeCurrency": {
    "name": "Neonlink Native Token",
    "symbol": "NEON",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://neonlink.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.neonlink.io"
  ],
  "shortName": "neon",
  "slug": "neonlink",
  "testnet": false
} as const satisfies Chain;