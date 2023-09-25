import type { Chain } from "../src/types";
export default {
  "chainId": 1985,
  "chain": "TUSHY",
  "name": "SatoshIE",
  "rpc": [
    "https://satoshie.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.satosh.ie"
  ],
  "slug": "satoshie",
  "icon": {
    "url": "ipfs://QmRHT4o9ihiY6nVkkRdwZjdugbEAQiXrrov3GS9a3GTuL7",
    "width": 1024,
    "height": 1024,
    "format": "jpg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Tushy Token",
    "symbol": "TUSHY",
    "decimals": 18
  },
  "infoURL": "https://satosh.ie",
  "shortName": "satoshie",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "mainnetexplorer",
      "url": "http://explore.satosh.ie",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;