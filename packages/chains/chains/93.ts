import type { Chain } from "../src/types";
export default {
  "chainId": 93,
  "chain": "GAR",
  "name": "Garizon Stage3",
  "rpc": [
    "https://garizon-stage3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s3.garizon.net/rpc"
  ],
  "slug": "garizon-stage3",
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "shortName": "gar-s3",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.garizon.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;