import type { Chain } from "../src/types";
export default {
  "name": "Amana Mixnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Amana Mixnet",
    "symbol": "MEER-M",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "amanamix",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 81342,
  "networkId": 81342,
  "status": "incubating",
  "testnet": false,
  "slug": "amana-mixnet"
} as const satisfies Chain;