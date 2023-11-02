import type { Chain } from "../src/types";
export default {
  "chain": "PepeNetwork",
  "chainId": 9779,
  "explorers": [
    {
      "name": "Pepe Explorer",
      "url": "https://explorer.pepenetwork.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmPX3uipdwd195z1MJff7uj8hpZdSuVvM5z47eiz2o7Gz5",
        "width": 960,
        "height": 944,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPX3uipdwd195z1MJff7uj8hpZdSuVvM5z47eiz2o7Gz5",
    "width": 960,
    "height": 944,
    "format": "png"
  },
  "infoURL": "https://pepenetwork.io",
  "name": "PepeNetwork Mainnet",
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "WPEPE",
    "decimals": 18
  },
  "networkId": 9779,
  "rpc": [
    "https://pepenetwork.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9779.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.pepenetwork.io"
  ],
  "shortName": "pn",
  "slug": "pepenetwork",
  "testnet": false
} as const satisfies Chain;