import type { Chain } from "../src/types";
export default {
  "name": "PepeNetwork Mainnet",
  "chain": "PepeNetwork",
  "rpc": [
    "https://pepenetwork.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.pepenetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "WPEPE",
    "decimals": 18
  },
  "infoURL": "https://pepenetwork.io",
  "shortName": "pn",
  "chainId": 9779,
  "networkId": 9779,
  "icon": {
    "url": "ipfs://QmPX3uipdwd195z1MJff7uj8hpZdSuVvM5z47eiz2o7Gz5",
    "width": 960,
    "height": 944,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Pepe Explorer",
      "url": "https://explorer.pepenetwork.io",
      "icon": {
        "url": "ipfs://QmPX3uipdwd195z1MJff7uj8hpZdSuVvM5z47eiz2o7Gz5",
        "width": 960,
        "height": 944,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "pepenetwork"
} as const satisfies Chain;