import type { Chain } from "../src/types";
export default {
  "chain": "GAR",
  "chainId": 93,
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
  "name": "Garizon Stage3",
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "networkId": 93,
  "parent": {
    "type": "shard",
    "chain": "eip155-90"
  },
  "rpc": [
    "https://garizon-stage3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://93.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s3.garizon.net/rpc"
  ],
  "shortName": "gar-s3",
  "slug": "garizon-stage3",
  "testnet": false
} as const satisfies Chain;