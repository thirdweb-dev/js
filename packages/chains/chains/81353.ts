import type { Chain } from "../src/types";
export default {
  "chainId": 81353,
  "chain": "MEER",
  "name": "Flana Privnet",
  "rpc": [],
  "slug": "flana-privnet",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Flana Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "flanapriv",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;