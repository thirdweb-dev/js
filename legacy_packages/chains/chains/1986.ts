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
  "infoURL": "https://satosh.ie",
  "name": "SatoshIE Testnet",
  "nativeCurrency": {
    "name": "Tushy Token",
    "symbol": "TUSHY",
    "decimals": 18
  },
  "networkId": 1986,
  "rpc": [
    "https://1986.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.satosh.ie"
  ],
  "shortName": "satoshie_testnet",
  "slip44": 1,
  "slug": "satoshie-testnet",
  "testnet": true
} as const satisfies Chain;