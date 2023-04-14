import type { Chain } from "../src/types";
export default {
  "name": "Flana Mixnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Flana Mixnet",
    "symbol": "MEER-M",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "flanamix",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 81352,
  "networkId": 81352,
  "status": "incubating",
  "testnet": false,
  "slug": "flana-mixnet"
} as const satisfies Chain;