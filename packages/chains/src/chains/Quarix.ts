import type { Chain } from "../types";
export default {
  "chain": "Quarix",
  "chainId": 8888888,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTw8TyeeNhUFWrck2WCiN17MaHRt5qzRBtaAvmz6L7qq7",
    "width": 669,
    "height": 587,
    "format": "png"
  },
  "name": "Quarix",
  "nativeCurrency": {
    "name": "QARE",
    "symbol": "QARE",
    "decimals": 18
  },
  "networkId": 8888888,
  "rpc": [],
  "shortName": "quarix",
  "slug": "quarix",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;