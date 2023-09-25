import type { Chain } from "../src/types";
export default {
  "chainId": 416,
  "chain": "SX",
  "name": "SX Network Mainnet",
  "rpc": [
    "https://sx-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sx.technology"
  ],
  "slug": "sx-network",
  "icon": {
    "url": "ipfs://QmSXLXqyr2H6Ja5XrmznXbWTEvF2gFaL8RXNXgyLmDHjAF",
    "width": 896,
    "height": 690,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "SX Network",
    "symbol": "SX",
    "decimals": 18
  },
  "infoURL": "https://www.sx.technology",
  "shortName": "SX",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "SX Network Explorer",
      "url": "https://explorer.sx.technology",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;