import type { Chain } from "../src/types";
export default {
  "chainId": 501,
  "chain": "CAM",
  "name": "Columbus Test Network",
  "rpc": [
    "https://columbus-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://columbus.camino.network/ext/bc/C/rpc"
  ],
  "slug": "columbus-test-network",
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
  "shortName": "Columbus",
  "testnet": true,
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