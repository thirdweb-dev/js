import type { Chain } from "../src/types";
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
    "https://1285.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonriver.moonbeam.network",
    "wss://wss.api.moonriver.moonbeam.network",
    "https://moonriver.public.blastapi.io",
    "wss://moonriver.public.blastapi.io",
    "https://moonriver-rpc.dwellir.com",
    "wss://moonriver-rpc.dwellir.com",
    "https://moonriver.api.onfinality.io/public",
    "wss://moonriver.api.onfinality.io/public-ws",
    "https://moonriver.unitedbloc.com",
    "wss://moonriver.unitedbloc.com",
    "https://moonriver-rpc.publicnode.com",
    "wss://moonriver-rpc.publicnode.com",
    "https://moonriver.drpc.org",
    "wss://moonriver.drpc.org"
  ],
  "shortName": "mriver",
  "slug": "moonriver",
  "testnet": false
} as const satisfies Chain;