import type { Chain } from "../src/types";
export default {
  "chainId": 5777,
  "chain": "ETH",
  "name": "Ganache",
  "rpc": [
    "https://ganache.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://127.0.0.1:7545"
  ],
  "slug": "ganache",
  "icon": {
    "url": "ipfs://Qmc9N7V8CiLB4r7FEcG7GojqfiGGsRCZqcFWCahwMohbDW",
    "width": 267,
    "height": 300,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ganache Test Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://trufflesuite.com/ganache/",
  "shortName": "ggui",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;