import type { Chain } from "../src/types";
export default {
  "chain": "SX",
  "chainId": 647,
  "explorers": [
    {
      "name": "SX Network Toronto Explorer",
      "url": "https://explorer.toronto.sx.technology",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.toronto.sx.technology"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmSXLXqyr2H6Ja5XrmznXbWTEvF2gFaL8RXNXgyLmDHjAF",
    "width": 896,
    "height": 690,
    "format": "png"
  },
  "infoURL": "https://www.sx.technology",
  "name": "SX Network Testnet",
  "nativeCurrency": {
    "name": "SX Network",
    "symbol": "SX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://sx-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.toronto.sx.technology"
  ],
  "shortName": "SX-Testnet",
  "slug": "sx-network-testnet",
  "testnet": true
} as const satisfies Chain;