import type { Chain } from "../src/types";
export default {
  "chain": "MAPO",
  "chainId": 22776,
  "explorers": [
    {
      "name": "maposcan",
      "url": "https://maposcan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcLdQ8gM4iHv3CCKA9HuxmzTxY4WhjWtepUVCc3dpzKxD",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://mapprotocol.io/",
  "name": "MAP Protocol",
  "nativeCurrency": {
    "name": "MAPO",
    "symbol": "MAPO",
    "decimals": 18
  },
  "networkId": 22776,
  "rpc": [
    "https://map-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://22776.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.maplabs.io"
  ],
  "shortName": "mapo",
  "slip44": 60,
  "slug": "map-protocol",
  "testnet": false
} as const satisfies Chain;