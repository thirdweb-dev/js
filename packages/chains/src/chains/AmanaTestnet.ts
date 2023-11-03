import type { Chain } from "../types";
export default {
  "chain": "MEER",
  "chainId": 81341,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://github.com/Qitmeer",
  "name": "Amana Testnet",
  "nativeCurrency": {
    "name": "Amana Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "networkId": 81341,
  "rpc": [],
  "shortName": "amanatest",
  "slug": "amana-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;