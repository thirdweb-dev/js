import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 167000,
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://taikoscan.io",
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
  "name": "Taiko Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 167000,
  "redFlags": [],
  "rpc": [
    "https://167000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.taiko.xyz/",
    "https://rpc.ankr.com/taiko/",
    "https://rpc.taiko.xyz/",
    "https://rpc.mainnet.taiko.xyz",
    "wss://ws.mainnet.taiko.xyz"
  ],
  "shortName": "tko-mainnet",
  "slug": "taiko",
  "status": "active",
  "testnet": false
} as const satisfies Chain;