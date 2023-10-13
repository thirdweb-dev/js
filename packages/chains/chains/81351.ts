import type { Chain } from "../src/types";
export default {
  "chain": "MEER",
  "chainId": 81351,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://github.com/Qitmeer",
  "name": "Flana Testnet",
  "nativeCurrency": {
    "name": "Flana Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "flanatest",
  "slug": "flana-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;