import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 5777,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmc9N7V8CiLB4r7FEcG7GojqfiGGsRCZqcFWCahwMohbDW",
    "width": 267,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://trufflesuite.com/ganache/",
  "name": "Ganache",
  "nativeCurrency": {
    "name": "Ganache Test Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ganache.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://127.0.0.1:7545"
  ],
  "shortName": "ggui",
  "slug": "ganache",
  "testnet": true
} as const satisfies Chain;