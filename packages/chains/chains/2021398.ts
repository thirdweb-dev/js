import type { Chain } from "../src/types";
export default {
  "chainId": 2021398,
  "chain": "DeBank",
  "name": "DeBank Testnet",
  "rpc": [
    "https://debank-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.testnet.debank.com"
  ],
  "slug": "debank-testnet",
  "icon": {
    "url": "ipfs://QmW9pBps8WHRRWmyXhjLZrjZJUe8F48hUu7z98bu2RVsjN",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "DeBank USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://debank.com",
  "shortName": "dbk",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "DeBank Chain Explorer",
      "url": "https://explorer.testnet.debank.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;