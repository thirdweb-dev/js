import type { Chain } from "../src/types";
export default {
  "chain": "SX",
  "chainId": 416,
  "explorers": [
    {
      "name": "SX Network Explorer",
      "url": "https://explorer.sx.technology",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSXLXqyr2H6Ja5XrmznXbWTEvF2gFaL8RXNXgyLmDHjAF",
    "width": 896,
    "height": 690,
    "format": "png"
  },
  "infoURL": "https://www.sx.technology",
  "name": "SX Network Mainnet",
  "nativeCurrency": {
    "name": "SX Network",
    "symbol": "SX",
    "decimals": 18
  },
  "networkId": 416,
  "rpc": [
    "https://sx-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://416.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sx.technology"
  ],
  "shortName": "SX",
  "slug": "sx-network",
  "testnet": false
} as const satisfies Chain;