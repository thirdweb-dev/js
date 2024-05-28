import type { Chain } from "../src/types";
export default {
  "chain": "TUSHY",
  "chainId": 1985,
  "explorers": [
    {
      "name": "mainnetexplorer",
      "url": "http://explore.satosh.ie",
      "standard": "none"
    }
  ],
  "faucets": [],
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