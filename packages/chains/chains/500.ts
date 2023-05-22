import type { Chain } from "../src/types";
export default {
  "name": "Camino C-Chain",
  "chain": "CAM",
  "rpc": [
    "https://camino-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.camino.network/ext/bc/C/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Camino",
    "symbol": "CAM",
    "decimals": 18
  },
  "infoURL": "https://camino.network/",
  "shortName": "Camino",
  "chainId": 500,
  "networkId": 1000,
  "icon": {
    "url": "ipfs://QmSEoUonisawfCvT3osysuZzbqUEHugtgNraePKWL8PKYa",
    "width": 768,
    "height": 768,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockexplorer",
      "url": "https://suite.camino.network/explorer",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "camino-c-chain"
} as const satisfies Chain;