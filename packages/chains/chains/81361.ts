import type { Chain } from "../src/types";
export default {
  "name": "Mizana Testnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Mizana Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "mizanatest",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 81361,
  "networkId": 81361,
  "status": "incubating",
  "testnet": true,
  "slug": "mizana-testnet"
} as const satisfies Chain;