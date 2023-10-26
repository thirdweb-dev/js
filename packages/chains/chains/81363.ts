import type { Chain } from "../src/types";
export default {
  "chain": "MEER",
  "chainId": 81363,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://github.com/Qitmeer",
  "name": "Mizana Privnet",
  "nativeCurrency": {
    "name": "Mizana Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "networkId": 81363,
  "rpc": [],
  "shortName": "mizanapriv",
  "slug": "mizana-privnet",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;