import type { Chain } from "../src/types";
export default {
  "name": "Amana Testnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Amana Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "amanatest",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 81341,
  "networkId": 81341,
  "status": "incubating",
  "testnet": true,
  "slug": "amana-testnet"
} as const satisfies Chain;