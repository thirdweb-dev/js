import type { Chain } from "../src/types";
export default {
  "chain": "DeBank",
  "chainId": 20240324,
  "explorers": [
    {
      "name": "DeBank Chain Explorer",
      "url": "https://sepolia-explorer.testnet.debank.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW9pBps8WHRRWmyXhjLZrjZJUe8F48hUu7z98bu2RVsjN",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://debank.com",
  "name": "DeBank Sepolia Testnet",
  "nativeCurrency": {
    "name": "DeBank USD",
    "symbol": "USD",
    "decimals": 18
  },
  "networkId": 20240324,
  "rpc": [
    "https://20240324.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rpc.testnet.debank.com"
  ],
  "shortName": "dbkse",
  "slip44": 1,
  "slug": "debank-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;