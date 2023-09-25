import type { Chain } from "../src/types";
export default {
  "chainId": 81363,
  "chain": "MEER",
  "name": "Mizana Privnet",
  "rpc": [],
  "slug": "mizana-privnet",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Mizana Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "mizanapriv",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;