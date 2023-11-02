import type { Chain } from "../src/types";
export default {
  "chain": "MEER",
  "chainId": 81353,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://github.com/Qitmeer",
  "name": "Flana Privnet",
  "nativeCurrency": {
    "name": "Flana Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "networkId": 81353,
  "rpc": [],
  "shortName": "flanapriv",
  "slug": "flana-privnet",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;