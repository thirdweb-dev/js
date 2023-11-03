import type { Chain } from "../types";
export default {
  "chain": "MOON",
  "chainId": 1285,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonriver.moonscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://moonbeam.network/networks/moonriver/",
  "name": "Moonriver",
  "nativeCurrency": {
    "name": "Moonriver",
    "symbol": "MOVR",
    "decimals": 18
  },
  "networkId": 1285,
  "rpc": [
    "https://moonriver.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1285.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonriver.moonbeam.network",
    "wss://wss.api.moonriver.moonbeam.network",
    "https://moonriver.publicnode.com",
    "wss://moonriver.publicnode.com"
  ],
  "shortName": "mriver",
  "slug": "moonriver",
  "testnet": false
} as const satisfies Chain;