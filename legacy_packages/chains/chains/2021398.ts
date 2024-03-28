import type { Chain } from "../src/types";
export default {
  "chain": "DeBank",
  "chainId": 2021398,
  "explorers": [
    {
      "name": "DeBank Chain Explorer",
      "url": "https://explorer.testnet.debank.com",
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
  "name": "DeBank Testnet",
  "nativeCurrency": {
    "name": "DeBank USD",
    "symbol": "USD",
    "decimals": 18
  },
  "networkId": 2021398,
  "rpc": [
    "https://2021398.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.testnet.debank.com"
  ],
  "shortName": "dbk",
  "slip44": 1,
  "slug": "debank-testnet",
  "testnet": true
} as const satisfies Chain;