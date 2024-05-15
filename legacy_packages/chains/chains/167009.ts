import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 167009,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscoutapi.hekla.taiko.xyz",
      "standard": "EIP3091"
    },
    {
      "name": "routescan",
      "url": "https://hekla.taikoscan.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcHdmVr5VRUJq13jnM6tgah5Ge7hn3Dm14eY6vwivJ5ui",
    "width": 288,
    "height": 258,
    "format": "png"
  },
  "infoURL": "https://taiko.xyz",
  "name": "Taiko Hekla L2",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 167009,
  "redFlags": [],
  "rpc": [
    "https://167009.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://taiko-hekla.blockpi.network/v1/rpc/public",
    "https://rpc.hekla.taiko.xyz",
    "wss://ws.hekla.taiko.xyz"
  ],
  "shortName": "tko-hekla",
  "slug": "taiko-hekla-l2",
  "status": "active",
  "testnet": false
} as const satisfies Chain;