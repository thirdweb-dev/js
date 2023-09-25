import type { Chain } from "../src/types";
export default {
  "chainId": 90,
  "chain": "GAR",
  "name": "Garizon Stage0",
  "rpc": [
    "https://garizon-stage0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s0.garizon.net/rpc"
  ],
  "slug": "garizon-stage0",
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
  "shortName": "gar-s0",
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