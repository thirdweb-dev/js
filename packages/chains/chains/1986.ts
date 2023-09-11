import type { Chain } from "../src/types";
export default {
  "name": "SatoshIE Testnet",
  "chain": "TUSHY",
  "rpc": [
    "https://satoshie-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.satosh.ie"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tushy Token",
    "symbol": "TUSHY",
    "decimals": 18
  },
  "infoURL": "https://satosh.ie",
  "shortName": "satoshie_testnet",
  "chainId": 1986,
  "networkId": 1986,
  "icon": {
    "url": "ipfs://QmRHT4o9ihiY6nVkkRdwZjdugbEAQiXrrov3GS9a3GTuL7",
    "width": 1024,
    "height": 1024,
    "format": "jpg"
  },
  "explorers": [
    {
      "name": "testnetexplorer",
      "url": "http://explore-testnet.satosh.ie",
      "icon": {
        "url": "ipfs://QmRHT4o9ihiY6nVkkRdwZjdugbEAQiXrrov3GS9a3GTuL7",
        "width": 1024,
        "height": 1024,
        "format": "jpg"
      },
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "satoshie-testnet"
} as const satisfies Chain;