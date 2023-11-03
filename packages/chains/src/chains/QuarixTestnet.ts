import type { Chain } from "../types";
export default {
  "chain": "Quarix",
  "chainId": 8888881,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTw8TyeeNhUFWrck2WCiN17MaHRt5qzRBtaAvmz6L7qq7",
    "width": 669,
    "height": 587,
    "format": "png"
  },
  "name": "Quarix Testnet",
  "nativeCurrency": {
    "name": "QARE",
    "symbol": "QARE",
    "decimals": 18
  },
  "networkId": 8888881,
  "rpc": [],
  "shortName": "quarix-testnet",
  "slug": "quarix-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;