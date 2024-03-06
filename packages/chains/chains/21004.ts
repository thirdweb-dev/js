import type { Chain } from "../src/types";
export default {
  "chain": "C4EI",
  "chainId": 21004,
  "explorers": [
    {
      "name": "C4EI sirato",
      "url": "https://exp.c4ei.net",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmNPQBLEau3DsUYczt9QCLqZd9jK488GhF5y2SbtLRSrvB",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://play.google.com/store/apps/details?id=net.c4ei.fps2"
  ],
  "infoURL": "https://c4ei.net",
  "name": "C4EI",
  "nativeCurrency": {
    "name": "C4EI",
    "symbol": "C4EI",
    "decimals": 18
  },
  "networkId": 21004,
  "rpc": [
    "https://21004.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.c4ei.net"
  ],
  "shortName": "c4ei",
  "slug": "c4ei",
  "testnet": false
} as const satisfies Chain;