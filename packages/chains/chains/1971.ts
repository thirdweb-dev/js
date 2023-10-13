import type { Chain } from "../src/types";
export default {
  "chain": "ALTR",
  "chainId": 1971,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreigcquvoalec3ll2m26v4wsx5enlxwyn6nk2mgfqwncyqrgwivla5u",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://1971.network/",
  "name": "Atelier",
  "nativeCurrency": {
    "name": "ATLR",
    "symbol": "ATLR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://atelier.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1971.network/atlr",
    "wss://1971.network/atlr"
  ],
  "shortName": "atlr",
  "slug": "atelier",
  "testnet": true
} as const satisfies Chain;