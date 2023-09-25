import type { Chain } from "../src/types";
export default {
  "chainId": 901,
  "chain": "GAR",
  "name": "Garizon Testnet Stage1",
  "rpc": [
    "https://garizon-testnet-stage1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s1-testnet.garizon.net/rpc"
  ],
  "slug": "garizon-testnet-stage1",
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "faucets": [
    "https://faucet-testnet.garizon.com"
  ],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "shortName": "gar-test-s1",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer-testnet.garizon.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;