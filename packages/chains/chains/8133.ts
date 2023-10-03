import type { Chain } from "../src/types";
export default {
  "chain": "MEER",
  "chainId": 8133,
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
  "name": "Qitmeer Network Privnet",
  "nativeCurrency": {
    "name": "Qitmeer Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "meerpriv",
  "slug": "qitmeer-network-privnet",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;