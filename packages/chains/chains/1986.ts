import type { Chain } from "../src/types";
export default {
  "chainId": 1986,
  "chain": "TUSHY",
  "name": "SatoshIE Testnet",
  "rpc": [
    "https://satoshie-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.satosh.ie"
  ],
  "slug": "satoshie-testnet",
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
  "shortName": "satoshie_testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "testnetexplorer",
      "url": "http://explore-testnet.satosh.ie",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;