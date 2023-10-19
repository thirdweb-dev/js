import type { Chain } from "../src/types";
export default {
  "chain": "MAP",
  "chainId": 22776,
  "explorers": [
    {
      "name": "mapscan",
      "url": "https://mapscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcLdQ8gM4iHv3CCKA9HuxmzTxY4WhjWtepUVCc3dpzKxD",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://maplabs.io",
  "name": "MAP Mainnet",
  "nativeCurrency": {
    "name": "MAPO",
    "symbol": "MAPO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://map.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.maplabs.io"
  ],
  "shortName": "map",
  "slug": "map",
  "testnet": false
} as const satisfies Chain;