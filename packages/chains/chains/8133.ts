import type { Chain } from "../src/types";
export default {
  "chainId": 8133,
  "chain": "MEER",
  "name": "Qitmeer Network Privnet",
  "rpc": [],
  "slug": "qitmeer-network-privnet",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Qitmeer Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "meerpriv",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;