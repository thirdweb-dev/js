import type { Chain } from "../src/types";
export default {
  "chain": "KaspaClassic",
  "chainId": 104566,
  "explorers": [
    {
      "name": "KaspaClassic Explorer",
      "url": "https://explorer.kaspaclassic.world",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNMuNBwg9opKvsnrDaoYBP743LeddeooQupVYjpBXf7d7",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://kaspaclassic.com/",
  "name": "KaspaClassic Mainnet",
  "nativeCurrency": {
    "name": "KaspaClassic",
    "symbol": "CAS",
    "decimals": 18
  },
  "networkId": 104566,
  "rpc": [
    "https://104566.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.kaspaclassic.world/",
    "http://80.178.101.118:8000/"
  ],
  "shortName": "cas",
  "slug": "kaspaclassic",
  "testnet": false
} as const satisfies Chain;