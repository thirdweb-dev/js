import type { Chain } from "../src/types";
export default {
  "name": "Mizana Mixnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Mizana Mixnet",
    "symbol": "MEER-M",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "mizanamix",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 81362,
  "networkId": 81362,
  "status": "incubating",
  "testnet": false,
  "slug": "mizana-mixnet"
} as const satisfies Chain;