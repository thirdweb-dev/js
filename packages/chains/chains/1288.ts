import type { Chain } from "../src/types";
export default {
  "chainId": 1288,
  "chain": "MOON",
  "name": "Moonrock",
  "rpc": [
    "https://moonrock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonrock.moonbeam.network",
    "wss://wss.api.moonrock.moonbeam.network"
  ],
  "slug": "moonrock",
  "faucets": [],
  "nativeCurrency": {
    "name": "Rocs",
    "symbol": "ROC",
    "decimals": 18
  },
  "infoURL": "https://docs.moonbeam.network/learn/platform/networks/overview/",
  "shortName": "mrock",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;