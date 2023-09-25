import type { Chain } from "../src/types";
export default {
  "chainId": 81351,
  "chain": "MEER",
  "name": "Flana Testnet",
  "rpc": [],
  "slug": "flana-testnet",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Flana Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "flanatest",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;