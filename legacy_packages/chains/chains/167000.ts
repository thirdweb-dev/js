import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 167000,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcHdmVr5VRUJq13jnM6tgah5Ge7hn3Dm14eY6vwivJ5ui",
    "width": 288,
    "height": 258,
    "format": "png"
  },
  "infoURL": "https://taiko.xyz",
  "name": "Taiko Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 167000,
  "rpc": [
    "https://167000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.taiko.xyz",
    "wss://ws.taiko.xyz"
  ],
  "shortName": "tko-mainnet",
  "slug": "taiko",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;