import type { Chain } from "../src/types";
export default {
  "name": "Qitmeer Network Privnet",
  "chain": "MEER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Qitmeer Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "meerpriv",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 8133,
  "networkId": 8133,
  "status": "incubating",
  "testnet": false,
  "slug": "qitmeer-network-privnet"
} as const satisfies Chain;