import type { Chain } from "../src/types";
export default {
  "chain": "Areon",
  "chainId": 463,
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
  "name": "Areon Network Mainnet",
  "nativeCurrency": {
    "name": "Areon",
    "symbol": "AREA",
    "decimals": 18
  },
  "networkId": 463,
  "rpc": [
    "https://areon-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://463.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.areon.network"
  ],
  "shortName": "area",
  "slug": "areon-network",
  "testnet": false
} as const satisfies Chain;