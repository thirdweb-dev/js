import type { Chain } from "../src/types";
export default {
  "chain": "DTBX",
  "chainId": 7923,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.dotblox.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://explorer.dotblox.io",
  "name": "Dot Blox",
  "nativeCurrency": {
    "name": "Dot Blox",
    "symbol": "DTBX",
    "decimals": 18
  },
  "networkId": 7923,
  "rpc": [
    "https://7923.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dotblox.io"
  ],
  "shortName": "DTBX",
  "slug": "dot-blox",
  "testnet": false
} as const satisfies Chain;