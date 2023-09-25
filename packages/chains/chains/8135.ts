import type { Chain } from "../src/types";
export default {
  "chainId": 8135,
  "chain": "MEER",
  "name": "Flana",
  "rpc": [],
  "slug": "flana",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Flana Mainnet",
    "symbol": "MEER",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "flana",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;