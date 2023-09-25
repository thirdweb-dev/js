import type { Chain } from "../src/types";
export default {
  "chainId": 81342,
  "chain": "MEER",
  "name": "Amana Mixnet",
  "rpc": [],
  "slug": "amana-mixnet",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Amana Mixnet",
    "symbol": "MEER-M",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "amanamix",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;