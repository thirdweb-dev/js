import type { Chain } from "../src/types";
export default {
  "name": "DeBank Testnet",
  "chain": "DeBank",
  "rpc": [
    "https://debank-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.testnet.debank.com"
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW9pBps8WHRRWmyXhjLZrjZJUe8F48hUu7z98bu2RVsjN",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "nativeCurrency": {
    "name": "DeBank USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://debank.com",
  "shortName": "dbk",
  "chainId": 2021398,
  "networkId": 2021398,
  "explorers": [
    {
      "name": "DeBank Chain Explorer",
      "url": "https://explorer.testnet.debank.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "debank-testnet"
} as const satisfies Chain;