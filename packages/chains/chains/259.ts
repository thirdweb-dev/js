import type { Chain } from "../src/types";
export default {
  "chainId": 259,
  "chain": "Neonlink",
  "name": "Neonlink Mainnet",
  "rpc": [
    "https://neonlink.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.neonlink.io"
  ],
  "slug": "neonlink",
  "icon": {
    "url": "ipfs://QmX3hBv8WyvVfYjh1gmgDfJCpJBvKk4TYG9wFX9sC8WAjz",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Neonlink Native Token",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neonlink.io",
  "shortName": "neon",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Neon Blockchain Explorer",
      "url": "https://scan.neonlink.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;