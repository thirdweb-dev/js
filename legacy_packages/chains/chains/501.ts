import type { Chain } from "../src/types";
export default {
  "chain": "CAM",
  "chainId": 501,
  "explorers": [
    {
      "name": "blockexplorer",
      "url": "https://suite.camino.network/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://camino.network/",
  "name": "Columbus Test Network",
  "nativeCurrency": {
    "name": "Camino",
    "symbol": "CAM",
    "decimals": 18
  },
  "networkId": 1001,
  "rpc": [
    "https://501.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://columbus.camino.network/ext/bc/C/rpc"
  ],
  "shortName": "Columbus",
  "slip44": 1,
  "slug": "columbus-test-network",
  "testnet": true
} as const satisfies Chain;