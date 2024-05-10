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
  "infoURL": "https://moonbeam.network/networks/moonbeam/",
  "name": "Moonbeam",
  "nativeCurrency": {
    "name": "Glimmer",
    "symbol": "GLMR",
    "decimals": 18
  },
  "networkId": 1284,
  "rpc": [
    "https://1284.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonbeam.network",
    "wss://wss.api.moonbeam.network",
    "https://moonbeam.public.blastapi.io",
    "wss://moonbeam.public.blastapi.io",
    "https://moonbeam-rpc.dwellir.com",
    "wss://moonbeam-rpc.dwellir.com",
    "https://moonbeam.api.onfinality.io/public",
    "wss://moonbeam.api.onfinality.io/public-ws",
    "https://moonbeam.unitedbloc.com",
    "wss://moonbeam.unitedbloc.com",
    "https://moonbeam-rpc.publicnode.com",
    "wss://moonbeam-rpc.publicnode.com",
    "https://moonbeam.drpc.org",
    "wss://moonbeam.drpc.org"
  ],
  "shortName": "mbeam",
  "slug": "moonbeam",
  "testnet": false
} as const satisfies Chain;