import type { Chain } from "../src/types";
export default {
  "name": "Garizon Stage2",
  "chain": "GAR",
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "rpc": [
    "https://garizon-stage2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s2.garizon.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "shortName": "gar-s2",
  "chainId": 92,
  "networkId": 92,
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
  "parent": {
    "chain": "eip155-90",
    "type": "shard"
  },
  "testnet": false,
  "slug": "garizon-stage2"
} as const satisfies Chain;