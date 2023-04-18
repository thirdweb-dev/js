import type { Chain } from "../src/types";
export default {
  "name": "Mizana Privnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Mizana Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "mizanapriv",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 81363,
  "networkId": 81363,
  "status": "incubating",
  "testnet": false,
  "slug": "mizana-privnet"
} as const satisfies Chain;