import type { Chain } from "../src/types";
export default {
  "name": "SatoshIE",
  "chain": "TUSHY",
  "rpc": [
    "https://satoshie.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.satosh.ie"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tushy Token",
    "symbol": "TUSHY",
    "decimals": 18
  },
  "infoURL": "https://satosh.ie",
  "shortName": "satoshie",
  "chainId": 1985,
  "networkId": 1985,
  "icon": {
    "url": "ipfs://QmRHT4o9ihiY6nVkkRdwZjdugbEAQiXrrov3GS9a3GTuL7",
    "width": 1024,
    "height": 1024,
    "format": "jpg"
  },
  "explorers": [
    {
      "name": "mainnetexplorer",
      "url": "http://explore.satosh.ie",
      "icon": {
        "url": "ipfs://QmRHT4o9ihiY6nVkkRdwZjdugbEAQiXrrov3GS9a3GTuL7",
        "width": 1024,
        "height": 1024,
        "format": "jpg"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "satoshie"
} as const satisfies Chain;