import type { Chain } from "../src/types";
export default {
  "name": "Neonlink Mainnet",
  "chain": "Neonlink",
  "rpc": [
    "https://neonlink.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.neonlink.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Neonlink Native Token",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neonlink.io",
  "shortName": "neon",
  "chainId": 259,
  "networkId": 259,
  "icon": {
    "url": "ipfs://QmX3hBv8WyvVfYjh1gmgDfJCpJBvKk4TYG9wFX9sC8WAjz",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Neon Blockchain Explorer",
      "url": "https://scan.neonlink.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmX3hBv8WyvVfYjh1gmgDfJCpJBvKk4TYG9wFX9sC8WAjz",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "testnet": false,
  "slug": "neonlink"
} as const satisfies Chain;