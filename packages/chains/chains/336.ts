import type { Chain } from "../src/types";
export default {
  "chain": "SDN",
  "chainId": 336,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://shiden.subscan.io",
      "standard": "none"
    },
    {
      "name": "blockscout",
      "url": "https://blockscout.com/shiden",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQySjAoWHgk3ou1yvBi2TrTcgH6KhfGiU7GcrLzrAeRkE",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://shiden.astar.network/",
  "name": "Shiden",
  "nativeCurrency": {
    "name": "Shiden",
    "symbol": "SDN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://shiden.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://shiden.api.onfinality.io/public",
    "https://shiden-rpc.dwellir.com",
    "https://shiden.public.blastapi.io",
    "wss://shiden.api.onfinality.io/public-ws",
    "wss://shiden.public.blastapi.io",
    "wss://shiden-rpc.dwellir.com"
  ],
  "shortName": "sdn",
  "slug": "shiden",
  "testnet": false
} as const satisfies Chain;