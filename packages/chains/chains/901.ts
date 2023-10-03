import type { Chain } from "../src/types";
export default {
  "chain": "GAR",
  "chainId": 901,
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
  "name": "Garizon Testnet Stage1",
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://garizon-testnet-stage1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s1-testnet.garizon.net/rpc"
  ],
  "shortName": "gar-test-s1",
  "slug": "garizon-testnet-stage1",
  "testnet": true
} as const satisfies Chain;