import type { Chain } from "../src/types";
export default {
  "name": "Amana",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Amana Mainnet",
    "symbol": "MEER",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "amana",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 8134,
  "networkId": 8134,
  "status": "incubating",
  "testnet": false,
  "slug": "amana"
} as const satisfies Chain;