import type { Chain } from "../src/types";
export default {
  "chain": "BOAT",
  "chainId": 8047,
  "explorers": [
    {
      "name": "BOAT Mainnet Explorer",
      "url": "https://scan.come.boats",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreibqgh23s7yt7rikybybiwfivwtoh32n24scjykvgbgewo3ecbrcye",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreibqgh23s7yt7rikybybiwfivwtoh32n24scjykvgbgewo3ecbrcye",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://come.boats",
  "name": "BOAT Mainnet",
  "nativeCurrency": {
    "name": "Best Of All Time Token",
    "symbol": "BOAT",
    "decimals": 18
  },
  "networkId": 8047,
  "redFlags": [],
  "rpc": [
    "https://8047.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc0.come.boats/",
    "https://rpc0.come.boat/"
  ],
  "shortName": "boat",
  "slip44": 1,
  "slug": "boat",
  "testnet": false,
  "title": "BOAT Mainnet"
} as const satisfies Chain;