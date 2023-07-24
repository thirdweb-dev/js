import type { Chain } from "../src/types";
export default {
  "name": "Flana Privnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Flana Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "flanapriv",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 81353,
  "networkId": 81353,
  "status": "incubating",
  "testnet": false,
  "slug": "flana-privnet"
} as const satisfies Chain;