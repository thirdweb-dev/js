import type { Chain } from "../src/types";
export default {
  "chainId": 8655,
  "chain": "TOKI",
  "name": "Toki Testnet",
  "rpc": [
    "https://toki-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.buildwithtoki.com/v0/rpc"
  ],
  "slug": "toki-testnet",
  "icon": {
    "url": "ipfs://QmbCBBH4dFHGr8u1yQspCieQG9hLcPFNYdRx1wnVsX8hUw",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Toki",
    "symbol": "TOKI",
    "decimals": 18
  },
  "infoURL": "https://www.buildwithtoki.com",
  "shortName": "toki-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;