import type { Chain } from "../src/types";
export default {
  "name": "Garizon Stage0",
  "chain": "GAR",
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "rpc": [
    "https://garizon-stage0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s0.garizon.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "shortName": "gar-s0",
  "chainId": 90,
  "networkId": 90,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.garizon.com",
      "icon": {
        "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
        "width": 1024,
        "height": 613,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "garizon-stage0"
} as const satisfies Chain;