import type { Chain } from "../src/types";
export default {
  "name": "Flana Testnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Flana Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "flanatest",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 81351,
  "networkId": 81351,
  "status": "incubating",
  "testnet": true,
  "slug": "flana-testnet"
} as const satisfies Chain;