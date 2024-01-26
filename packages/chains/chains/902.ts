import type { Chain } from "../src/types";
export default {
  "chain": "GAR",
  "chainId": 902,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer-testnet.garizon.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
        "width": 1024,
        "height": 613,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet-testnet.garizon.com"
  ],
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "infoURL": "https://garizon.com",
  "name": "Garizon Testnet Stage2",
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "networkId": 902,
  "parent": {
    "type": "shard",
    "chain": "eip155-900"
  },
  "rpc": [
    "https://garizon-testnet-stage2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://902.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s2-testnet.garizon.net/rpc"
  ],
  "shortName": "gar-test-s2",
  "slip44": 1,
  "slug": "garizon-testnet-stage2",
  "testnet": true
} as const satisfies Chain;