import type { Chain } from "../src/types";
export default {
  "chain": "Skatechain",
  "chainId": 5051,
  "explorers": [
    {
      "name": "Nollie Skate Chain Testnet Explorer",
      "url": "https://nolliescan.skatechain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmdofX1W8QFt4TSDaq2wyPvYuUba9LabgD1MYcn3Hezu8h",
    "width": 600,
    "height": 875,
    "format": "png"
  },
  "name": "Nollie Skatechain Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5051,
  "rpc": [
    "https://5051.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nollie-rpc.skatechain.org/"
  ],
  "shortName": "nollie-testnet",
  "slug": "nollie-skatechain-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;