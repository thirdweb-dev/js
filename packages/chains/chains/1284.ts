import type { Chain } from "../src/types";
export default {
  "chainId": 1284,
  "chain": "MOON",
  "name": "Moonbeam",
  "rpc": [
    "https://moonbeam.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonbeam.network",
    "wss://wss.api.moonbeam.network"
  ],
  "slug": "moonbeam",
  "faucets": [],
  "nativeCurrency": {
    "name": "Glimmer",
    "symbol": "GLMR",
    "decimals": 18
  },
  "infoURL": "https://moonbeam.network/networks/moonbeam/",
  "shortName": "mbeam",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonbeam.moonscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;