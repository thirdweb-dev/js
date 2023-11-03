import type { Chain } from "../types";
export default {
  "chain": "MEER",
  "chainId": 81361,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://github.com/Qitmeer",
  "name": "Mizana Testnet",
  "nativeCurrency": {
    "name": "Mizana Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "networkId": 81361,
  "rpc": [],
  "shortName": "mizanatest",
  "slug": "mizana-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;