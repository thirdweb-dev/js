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
  "networkId": 462,
  "rpc": [
    "https://areon-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://462.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.areon.network",
    "https://testnet-rpc2.areon.network",
    "https://testnet-rpc3.areon.network",
    "https://testnet-rpc4.areon.network",
    "https://testnet-rpc5.areon.network"
  ],
  "shortName": "tarea",
  "slip44": 1,
  "slug": "areon-network-testnet",
  "testnet": true
} as const satisfies Chain;