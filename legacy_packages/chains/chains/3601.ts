import type { Chain } from "../src/types";
export default {
  "chain": "PandoProject",
  "chainId": 3601,
  "explorers": [
    {
      "name": "Pando Mainnet Explorer",
      "url": "https://explorer.pandoproject.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNduBtT5BNGDw7DjRwDvaZBb6gjxf46WD7BYhn4gauGc9",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://www.pandoproject.org/",
  "name": "PandoProject Mainnet",
  "nativeCurrency": {
    "name": "pando-token",
    "symbol": "PTX",
    "decimals": 18
  },
  "networkId": 3601,
  "rpc": [
    "https://3601.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api.pandoproject.org/rpc"
  ],
  "shortName": "pando-mainnet",
  "slug": "pandoproject",
  "testnet": false
} as const satisfies Chain;