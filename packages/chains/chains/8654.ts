import type { Chain } from "../src/types";
export default {
  "chainId": 8654,
  "chain": "TOKI",
  "name": "Toki Network",
  "rpc": [
    "https://toki-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.buildwithtoki.com/v0/rpc"
  ],
  "slug": "toki-network",
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
  "shortName": "toki",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;