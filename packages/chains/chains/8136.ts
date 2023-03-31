import type { Chain } from "../src/types";
export default {
  "name": "Mizana",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Mizana Mainnet",
    "symbol": "MEER",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "mizana",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 8136,
  "networkId": 8136,
  "status": "incubating",
  "testnet": false,
  "slug": "mizana"
} as const satisfies Chain;