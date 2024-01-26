import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 5777,
  "explorers": [],
  "faucets": [],
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
  "networkId": 5777,
  "rpc": [
    "https://ganache.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://127.0.0.1:7545"
  ],
  "shortName": "ggui",
  "slip44": 1,
  "slug": "ganache",
  "testnet": true,
  "title": "Ganache GUI Ethereum Testnet"
} as const satisfies Chain;