import type { Chain } from "../src/types";
export default {
  "chain": "GAR",
  "chainId": 90,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.garizon.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "infoURL": "https://garizon.com",
  "name": "Garizon Stage0",
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://garizon-stage0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s0.garizon.net/rpc"
  ],
  "shortName": "gar-s0",
  "slug": "garizon-stage0",
  "testnet": false
} as const satisfies Chain;