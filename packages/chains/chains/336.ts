import type { Chain } from "../src/types";
export default {
  "chainId": 336,
  "chain": "SDN",
  "name": "Shiden",
  "rpc": [
    "https://shiden.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://shiden.api.onfinality.io/public",
    "https://shiden-rpc.dwellir.com",
    "https://shiden.public.blastapi.io",
    "wss://shiden.api.onfinality.io/public-ws",
    "wss://shiden.public.blastapi.io",
    "wss://shiden-rpc.dwellir.com"
  ],
  "slug": "shiden",
  "icon": {
    "url": "ipfs://QmQySjAoWHgk3ou1yvBi2TrTcgH6KhfGiU7GcrLzrAeRkE",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Shiden",
    "symbol": "SDN",
    "decimals": 18
  },
  "infoURL": "https://shiden.astar.network/",
  "shortName": "sdn",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;