import type { Chain } from "../src/types";
export default {
  "chainId": 647,
  "chain": "SX",
  "name": "SX Network Testnet",
  "rpc": [
    "https://sx-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.toronto.sx.technology"
  ],
  "slug": "sx-network-testnet",
  "icon": {
    "url": "ipfs://QmSXLXqyr2H6Ja5XrmznXbWTEvF2gFaL8RXNXgyLmDHjAF",
    "width": 896,
    "height": 690,
    "format": "png"
  },
  "faucets": [
    "https://faucet.toronto.sx.technology"
  ],
  "nativeCurrency": {
    "name": "SX Network",
    "symbol": "SX",
    "decimals": 18
  },
  "infoURL": "https://www.sx.technology",
  "shortName": "SX-Testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "SX Network Toronto Explorer",
      "url": "https://explorer.toronto.sx.technology",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;