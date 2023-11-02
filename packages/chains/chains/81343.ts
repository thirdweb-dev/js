import type { Chain } from "../src/types";
export default {
  "chain": "MEER",
  "chainId": 81343,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://github.com/Qitmeer",
  "name": "Amana Privnet",
  "nativeCurrency": {
    "name": "Amana Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "networkId": 81343,
  "rpc": [],
  "shortName": "amanapriv",
  "slug": "amana-privnet",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;