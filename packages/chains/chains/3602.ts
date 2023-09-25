import type { Chain } from "../src/types";
export default {
  "chainId": 3602,
  "chain": "PandoProject",
  "name": "PandoProject Testnet",
  "rpc": [
    "https://pandoproject-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.ethrpc.pandoproject.org/rpc"
  ],
  "slug": "pandoproject-testnet",
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
  "shortName": "pando-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Pando Testnet Explorer",
      "url": "https://testnet.explorer.pandoproject.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;