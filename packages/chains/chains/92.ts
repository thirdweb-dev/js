import type { Chain } from "../src/types";
export default {
  "chain": "GAR",
  "chainId": 92,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.garizon.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
        "width": 1024,
        "height": 613,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "infoURL": "https://garizon.com",
  "name": "Garizon Stage2",
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "networkId": 92,
  "parent": {
    "type": "shard",
    "chain": "eip155-90"
  },
  "rpc": [
    "https://garizon-stage2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://92.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s2.garizon.net/rpc"
  ],
  "shortName": "gar-s2",
  "slug": "garizon-stage2",
  "testnet": false
} as const satisfies Chain;