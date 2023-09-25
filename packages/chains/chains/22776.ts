import type { Chain } from "../src/types";
export default {
  "chainId": 22776,
  "chain": "MAP",
  "name": "MAP Mainnet",
  "rpc": [
    "https://map.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.maplabs.io"
  ],
  "slug": "map",
  "icon": {
    "url": "ipfs://QmcLdQ8gM4iHv3CCKA9HuxmzTxY4WhjWtepUVCc3dpzKxD",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MAPO",
    "symbol": "MAPO",
    "decimals": 18
  },
  "infoURL": "https://maplabs.io",
  "shortName": "map",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "mapscan",
      "url": "https://mapscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;