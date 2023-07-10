import type { Chain } from "../src/types";
export default {
  "name": "Qitmeer Network Mixnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Qitmeer Mixnet",
    "symbol": "MEER-M",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "meermix",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 8132,
  "networkId": 8132,
  "status": "incubating",
  "testnet": false,
  "slug": "qitmeer-network-mixnet"
} as const satisfies Chain;