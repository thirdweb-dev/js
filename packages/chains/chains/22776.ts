import type { Chain } from "../src/types";
export default {
  "name": "MAP Mainnet",
  "chain": "MAP",
  "icon": {
    "url": "ipfs://QmcLdQ8gM4iHv3CCKA9HuxmzTxY4WhjWtepUVCc3dpzKxD",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://map.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.maplabs.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MAPO",
    "symbol": "MAPO",
    "decimals": 18
  },
  "infoURL": "https://maplabs.io",
  "shortName": "map",
  "chainId": 22776,
  "networkId": 22776,
  "slip44": 60,
  "explorers": [
    {
      "name": "mapscan",
      "url": "https://mapscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "map"
} as const satisfies Chain;