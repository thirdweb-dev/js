import type { Chain } from "../types";
export default {
  "chain": "CAM",
  "chainId": 500,
  "explorers": [
    {
      "name": "blockexplorer",
      "url": "https://suite.camino.network/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSEoUonisawfCvT3osysuZzbqUEHugtgNraePKWL8PKYa",
    "width": 768,
    "height": 768,
    "format": "png"
  },
  "infoURL": "https://camino.network/",
  "name": "Camino C-Chain",
  "nativeCurrency": {
    "name": "Camino",
    "symbol": "CAM",
    "decimals": 18
  },
  "networkId": 1000,
  "rpc": [
    "https://camino-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://500.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.camino.network/ext/bc/C/rpc"
  ],
  "shortName": "Camino",
  "slug": "camino-c-chain",
  "testnet": false
} as const satisfies Chain;