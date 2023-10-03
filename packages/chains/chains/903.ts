import type { Chain } from "../src/types";
export default {
  "chain": "GAR",
  "chainId": 903,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer-testnet.garizon.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet-testnet.garizon.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "infoURL": "https://garizon.com",
  "name": "Garizon Testnet Stage3",
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://garizon-testnet-stage3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s3-testnet.garizon.net/rpc"
  ],
  "shortName": "gar-test-s3",
  "slug": "garizon-testnet-stage3",
  "testnet": true
} as const satisfies Chain;