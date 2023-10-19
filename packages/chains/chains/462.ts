import type { Chain } from "../src/types";
export default {
  "chain": "Areon",
  "chainId": 462,
  "explorers": [
    {
      "name": "AreonScan",
      "url": "https://areonscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreihs2nrnizpcuzjmuu2yi7wrtwd7qlqje46qnil5bnntfbfkb2roea",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://areon.network",
  "name": "Areon Network Testnet",
  "nativeCurrency": {
    "name": "Areon",
    "symbol": "TAREA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://areon-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.areon.network"
  ],
  "shortName": "tarea",
  "slug": "areon-network-testnet",
  "testnet": true
} as const satisfies Chain;