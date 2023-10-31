import type { Chain } from "../src/types";
export default {
  "chain": "MOON",
  "chainId": 1288,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://docs.moonbeam.network/learn/platform/networks/overview/",
  "name": "Moonrock",
  "nativeCurrency": {
    "name": "Rocs",
    "symbol": "ROC",
    "decimals": 18
  },
  "networkId": 1288,
  "rpc": [
    "https://moonrock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1288.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonrock.moonbeam.network",
    "wss://wss.api.moonrock.moonbeam.network"
  ],
  "shortName": "mrock",
  "slug": "moonrock",
  "testnet": false
} as const satisfies Chain;