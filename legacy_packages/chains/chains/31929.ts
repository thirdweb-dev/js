import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 31929,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQHysdcSj7FemPm96k6ShNrc7bMcuzcqpD1gcUPY3YjA3/photo_2024-05-13%2017.19.03.jpeg",
    "width": 512,
    "height": 512,
    "format": "jpeg"
  },
  "name": "Worlds OP",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 31929,
  "redFlags": [],
  "rpc": [
    "https://31929.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-worlds-hwbmpbzcnh.t.conduit.xyz/"
  ],
  "shortName": "WorldsOP",
  "slug": "worlds-op",
  "testnet": true
} as const satisfies Chain;