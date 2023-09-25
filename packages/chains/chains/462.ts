import type { Chain } from "../src/types";
export default {
  "chainId": 462,
  "chain": "Areon",
  "name": "Areon Network Testnet",
  "rpc": [
    "https://areon-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.areon.network"
  ],
  "slug": "areon-network-testnet",
  "icon": {
    "url": "ipfs://bafkreihs2nrnizpcuzjmuu2yi7wrtwd7qlqje46qnil5bnntfbfkb2roea",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Areon",
    "symbol": "TAREA",
    "decimals": 18
  },
  "infoURL": "https://areon.network",
  "shortName": "tarea",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "AreonScan",
      "url": "https://areonscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;