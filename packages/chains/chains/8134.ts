import type { Chain } from "../src/types";
export default {
  "chainId": 8134,
  "chain": "MEER",
  "name": "Amana",
  "rpc": [],
  "slug": "amana",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Amana Mainnet",
    "symbol": "MEER",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "amana",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;