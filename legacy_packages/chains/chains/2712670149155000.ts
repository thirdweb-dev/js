import type { Chain } from "../src/types";
export default {
  "chain": "ZURA",
  "chainId": 2712670149155000,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://bafybeiez6za62lqpt6zoizlzs33poax4fl3czuecvze2peeknuhkrhk5om.ipfs.w3s.link/ZV_mascot_white_trans.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Zuraverse",
  "nativeCurrency": {
    "name": "ZURA",
    "symbol": "ZURA",
    "decimals": 18
  },
  "networkId": 2712670149155000,
  "redFlags": [],
  "rpc": [
    "https://2712670149155000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zuraverse-2712670149155000-1.jsonrpc.sagarpc.io"
  ],
  "shortName": "ZURA",
  "slug": "zuraverse",
  "testnet": false
} as const satisfies Chain;