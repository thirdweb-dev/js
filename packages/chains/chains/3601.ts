import type { Chain } from "../src/types";
export default {
  "chainId": 3601,
  "chain": "PandoProject",
  "name": "PandoProject Mainnet",
  "rpc": [
    "https://pandoproject.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api.pandoproject.org/rpc"
  ],
  "slug": "pandoproject",
  "icon": {
    "url": "ipfs://QmNduBtT5BNGDw7DjRwDvaZBb6gjxf46WD7BYhn4gauGc9",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "pando-token",
    "symbol": "PTX",
    "decimals": 18
  },
  "infoURL": "https://www.pandoproject.org/",
  "shortName": "pando-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Pando Mainnet Explorer",
      "url": "https://explorer.pandoproject.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;