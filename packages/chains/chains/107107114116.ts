import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 107107114116,
  "explorers": [],
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
  "networkId": 107107114116,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "rpc": [],
  "shortName": "kkrt-sepolia",
  "slug": "kakarot-sepolia",
  "testnet": false
} as const satisfies Chain;