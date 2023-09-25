import type { Chain } from "../src/types";
export default {
  "chainId": 500,
  "chain": "CAM",
  "name": "Camino C-Chain",
  "rpc": [
    "https://camino-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.camino.network/ext/bc/C/rpc"
  ],
  "slug": "camino-c-chain",
  "icon": {
    "url": "ipfs://QmSEoUonisawfCvT3osysuZzbqUEHugtgNraePKWL8PKYa",
    "width": 768,
    "height": 768,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Camino",
    "symbol": "CAM",
    "decimals": 18
  },
  "infoURL": "https://camino.network/",
  "shortName": "Camino",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockexplorer",
      "url": "https://suite.camino.network/explorer",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;