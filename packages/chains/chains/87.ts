import type { Chain } from "../src/types";
export default {
  "chainId": 87,
  "chain": "NNW",
  "name": "Nova Network",
  "rpc": [
    "https://nova-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.novanetwork.io",
    "https://0x57.redjackstudio.com",
    "https://rpc.novanetwork.io:9070"
  ],
  "slug": "nova-network",
  "icon": {
    "url": "ipfs://QmTTamJ55YGQwMboq4aqf3JjTEy5WDtjo4GBRQ5VdsWA6U",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Supernova",
    "symbol": "SNT",
    "decimals": 18
  },
  "infoURL": "https://novanetwork.io",
  "shortName": "nnw",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "novanetwork",
      "url": "https://explorer.novanetwork.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;