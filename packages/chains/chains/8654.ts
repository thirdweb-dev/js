import type { Chain } from "../src/types";
export default {
  "chain": "TOKI",
  "chainId": 8654,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbCBBH4dFHGr8u1yQspCieQG9hLcPFNYdRx1wnVsX8hUw",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://www.buildwithtoki.com",
  "name": "Toki Network",
  "nativeCurrency": {
    "name": "Toki",
    "symbol": "TOKI",
    "decimals": 18
  },
  "networkId": 8654,
  "rpc": [
    "https://8654.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.buildwithtoki.com/v0/rpc"
  ],
  "shortName": "toki",
  "slug": "toki-network",
  "testnet": false
} as const satisfies Chain;