import type { Chain } from "../src/types";
export default {
  "chain": "Shido Mainnet",
  "chainId": 9008,
  "explorers": [
    {
      "name": "Shidoblock Mainnet Explorer",
      "url": "https://shidoscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://shido.io",
  "name": "Shido Mainnet Block",
  "nativeCurrency": {
    "name": "Shido Mainnet Token",
    "symbol": "SHIDO",
    "decimals": 18
  },
  "networkId": 9008,
  "rpc": [
    "https://9008.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-nodes.shidoscan.com",
    "wss://wss-nodes.shidoscan.com",
    "https://rpc-delta-nodes.shidoscan.com",
    "wss://wss-delta-nodes.shidoscan.com"
  ],
  "shortName": "Shido",
  "slug": "shido-block",
  "testnet": false
} as const satisfies Chain;