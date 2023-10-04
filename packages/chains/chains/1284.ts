import type { Chain } from "../src/types";
export default {
  "chain": "MOON",
  "chainId": 1284,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonbeam.moonscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://moonbeam.network/networks/moonbeam/",
  "name": "Moonbeam",
  "nativeCurrency": {
    "name": "Glimmer",
    "symbol": "GLMR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://moonbeam.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonbeam.network",
    "wss://wss.api.moonbeam.network",
    "https://moonbeam.publicnode.com",
    "wss://moonbeam.publicnode.com"
  ],
  "shortName": "mbeam",
  "slug": "moonbeam",
  "testnet": false
} as const satisfies Chain;