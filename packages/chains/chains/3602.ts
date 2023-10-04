import type { Chain } from "../src/types";
export default {
  "chain": "PandoProject",
  "chainId": 3602,
  "explorers": [
    {
      "name": "Pando Testnet Explorer",
      "url": "https://testnet.explorer.pandoproject.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmNduBtT5BNGDw7DjRwDvaZBb6gjxf46WD7BYhn4gauGc9",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://www.pandoproject.org/",
  "name": "PandoProject Testnet",
  "nativeCurrency": {
    "name": "pando-token",
    "symbol": "PTX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://pandoproject-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.ethrpc.pandoproject.org/rpc"
  ],
  "shortName": "pando-testnet",
  "slug": "pandoproject-testnet",
  "testnet": true
} as const satisfies Chain;