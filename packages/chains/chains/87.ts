import type { Chain } from "../src/types";
export default {
  "chain": "NNW",
  "chainId": 87,
  "explorers": [
    {
      "name": "novanetwork",
      "url": "https://explorer.novanetwork.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmTTamJ55YGQwMboq4aqf3JjTEy5WDtjo4GBRQ5VdsWA6U",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://novanetwork.io",
  "name": "Nova Network",
  "nativeCurrency": {
    "name": "Supernova",
    "symbol": "SNT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://nova-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.novanetwork.io",
    "https://0x57.redjackstudio.com",
    "https://rpc.novanetwork.io:9070"
  ],
  "shortName": "nnw",
  "slug": "nova-network",
  "testnet": false
} as const satisfies Chain;