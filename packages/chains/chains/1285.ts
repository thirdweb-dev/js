import type { Chain } from "../src/types";
export default {
  "name": "Moonriver",
  "chain": "MOON",
  "rpc": [
    "https://moonriver.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonriver.moonbeam.network",
    "wss://wss.api.moonriver.moonbeam.network",
    "https://moonriver.publicnode.com",
    "wss://moonriver.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Moonriver",
    "symbol": "MOVR",
    "decimals": 18
  },
  "infoURL": "https://moonbeam.network/networks/moonriver/",
  "shortName": "mriver",
  "chainId": 1285,
  "networkId": 1285,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonriver.moonscan.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "moonriver"
} as const satisfies Chain;