import type { Chain } from "../src/types";
export default {
  "chainId": 1285,
  "chain": "MOON",
  "name": "Moonriver",
  "rpc": [
    "https://moonriver.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonriver.moonbeam.network",
    "wss://wss.api.moonriver.moonbeam.network"
  ],
  "slug": "moonriver",
  "faucets": [],
  "nativeCurrency": {
    "name": "Moonriver",
    "symbol": "MOVR",
    "decimals": 18
  },
  "infoURL": "https://moonbeam.network/networks/moonriver/",
  "shortName": "mriver",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonriver.moonscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;