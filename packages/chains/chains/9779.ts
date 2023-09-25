import type { Chain } from "../src/types";
export default {
  "chainId": 9779,
  "chain": "PepeNetwork",
  "name": "PepeNetwork Mainnet",
  "rpc": [
    "https://pepenetwork.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.pepenetwork.io"
  ],
  "slug": "pepenetwork",
  "icon": {
    "url": "ipfs://QmPX3uipdwd195z1MJff7uj8hpZdSuVvM5z47eiz2o7Gz5",
    "width": 960,
    "height": 944,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "PEPE",
    "decimals": 18
  },
  "infoURL": "https://pepenetwork.io",
  "shortName": "pn",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Pepe Explorer",
      "url": "https://explorer.pepenetwork.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;