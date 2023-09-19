import type { Chain } from "../src/types";
export default {
  "name": "Areon Network Testnet",
  "chain": "Areon",
  "icon": {
    "url": "ipfs://bafkreihs2nrnizpcuzjmuu2yi7wrtwd7qlqje46qnil5bnntfbfkb2roea",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [
    "https://areon-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.areon.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Areon",
    "symbol": "TAREA",
    "decimals": 18
  },
  "infoURL": "https://areon.network",
  "shortName": "tarea",
  "chainId": 462,
  "networkId": 462,
  "explorers": [
    {
      "name": "AreonScan",
      "url": "https://areonscan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "areon-network-testnet"
} as const satisfies Chain;