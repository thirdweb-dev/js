import type { Chain } from "../types";
export default {
  "chain": "DeBank",
  "chainId": 115,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW9pBps8WHRRWmyXhjLZrjZJUe8F48hUu7z98bu2RVsjN",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://debank.com",
  "name": "DeBank Testnet(Deprecated)",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 115,
  "rpc": [],
  "shortName": "debank-testnet",
  "slug": "debank-testnet-deprecated",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;