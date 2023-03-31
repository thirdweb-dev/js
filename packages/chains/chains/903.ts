import type { Chain } from "../src/types";
export default {
  "name": "Garizon Testnet Stage3",
  "chain": "GAR",
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "rpc": [
    "https://garizon-testnet-stage3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s3-testnet.garizon.net/rpc"
  ],
  "faucets": [
    "https://faucet-testnet.garizon.com"
  ],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "shortName": "gar-test-s3",
  "chainId": 903,
  "networkId": 903,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer-testnet.garizon.com",
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
    "chain": "eip155-900",
    "type": "shard"
  },
  "testnet": true,
  "slug": "garizon-testnet-stage3"
} as const satisfies Chain;