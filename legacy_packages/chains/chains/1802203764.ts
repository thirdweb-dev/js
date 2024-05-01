import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1802203764,
  "explorers": [
    {
      "name": "Kakarot Scan",
      "url": "https://sepolia.kakarotscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNTZ9nEomAXK6bLxUbMfTS1TvrsN22HU1zTtxHUpMkUhz",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://kakarot.org",
  "name": "Kakarot Sepolia",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1802203764,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "rpc": [
    "https://1802203764.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rpc.kakarot.org"
  ],
  "shortName": "kkrt-sepolia",
  "slug": "kakarot-sepolia",
  "testnet": false
} as const satisfies Chain;