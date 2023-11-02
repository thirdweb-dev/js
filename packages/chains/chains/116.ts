import type { Chain } from "../src/types";
export default {
  "chain": "DeBank",
  "chainId": 116,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW9pBps8WHRRWmyXhjLZrjZJUe8F48hUu7z98bu2RVsjN",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://debank.com",
  "name": "DeBank Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 116,
  "rpc": [],
  "shortName": "debank-mainnet",
  "slug": "debank",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;