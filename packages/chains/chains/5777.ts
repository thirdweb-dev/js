import type { Chain } from "../src/types";
export default {
  "name": "Ganache",
  "title": "Ganache GUI Ethereum Testnet",
  "chain": "ETH",
  "icon": {
    "url": "ipfs://Qmc9N7V8CiLB4r7FEcG7GojqfiGGsRCZqcFWCahwMohbDW",
    "width": 267,
    "height": 300,
    "format": "png"
  },
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ganache Test Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://trufflesuite.com/ganache/",
  "shortName": "ggui",
  "chainId": 5777,
  "networkId": 5777,
  "explorers": [],
  "testnet": true,
  "slug": "ganache"
} as const satisfies Chain;