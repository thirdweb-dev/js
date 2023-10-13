import type { Chain } from "../src/types";
export default {
  "chain": "TUSHY",
  "chainId": 1986,
  "explorers": [
    {
      "name": "testnetexplorer",
      "url": "http://explore-testnet.satosh.ie",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmRHT4o9ihiY6nVkkRdwZjdugbEAQiXrrov3GS9a3GTuL7",
    "width": 1024,
    "height": 1024,
    "format": "jpg"
  },
  "infoURL": "https://satosh.ie",
  "name": "SatoshIE Testnet",
  "nativeCurrency": {
    "name": "Tushy Token",
    "symbol": "TUSHY",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://satoshie-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.satosh.ie"
  ],
  "shortName": "satoshie_testnet",
  "slug": "satoshie-testnet",
  "testnet": true
} as const satisfies Chain;