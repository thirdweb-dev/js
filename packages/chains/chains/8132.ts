import type { Chain } from "../src/types";
export default {
  "chainId": 8132,
  "chain": "MEER",
  "name": "Qitmeer Network Mixnet",
  "rpc": [],
  "slug": "qitmeer-network-mixnet",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Qitmeer Mixnet",
    "symbol": "MEER-M",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "meermix",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;