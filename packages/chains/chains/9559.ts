import type { Chain } from "../src/types";
export default {
  "chainId": 9559,
  "chain": "Neonlink",
  "name": "Neonlink Testnet",
  "rpc": [
    "https://neonlink-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.neonlink.io"
  ],
  "slug": "neonlink-testnet",
  "icon": {
    "url": "ipfs://QmX3hBv8WyvVfYjh1gmgDfJCpJBvKk4TYG9wFX9sC8WAjz",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [
    "https://faucet.neonlink.io/"
  ],
  "nativeCurrency": {
    "name": "Neonlink Native Token",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neonlink.io",
  "shortName": "testneon",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Neon Blockchain Explorer",
      "url": "https://testnet-scan.neonlink.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;