import type { Chain } from "../src/types";
export default {
  "chainId": 1971,
  "chain": "ALTR",
  "name": "Atelier",
  "rpc": [
    "https://atelier.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1971.network/atlr",
    "wss://1971.network/atlr"
  ],
  "slug": "atelier",
  "icon": {
    "url": "ipfs://bafkreigcquvoalec3ll2m26v4wsx5enlxwyn6nk2mgfqwncyqrgwivla5u",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ATLR",
    "symbol": "ATLR",
    "decimals": 18
  },
  "infoURL": "https://1971.network/",
  "shortName": "atlr",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;