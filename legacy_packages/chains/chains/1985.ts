import type { Chain } from "../src/types";
export default {
  "chain": "TUSHY",
  "chainId": 1985,
  "explorers": [
    {
      "name": "mainnetexplorer",
      "url": "http://explore.satosh.ie",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmRHT4o9ihiY6nVkkRdwZjdugbEAQiXrrov3GS9a3GTuL7",
        "width": 1024,
        "height": 1024,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRHT4o9ihiY6nVkkRdwZjdugbEAQiXrrov3GS9a3GTuL7",
    "width": 1024,
    "height": 1024,
    "format": "jpg"
  },
  "infoURL": "https://satosh.ie",
  "name": "SatoshIE",
  "nativeCurrency": {
    "name": "Tushy Token",
    "symbol": "TUSHY",
    "decimals": 18
  },
  "networkId": 1985,
  "rpc": [
    "https://1985.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.satosh.ie"
  ],
  "shortName": "satoshie",
  "slug": "satoshie",
  "testnet": false
} as const satisfies Chain;