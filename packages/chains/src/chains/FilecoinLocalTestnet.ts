import type { Chain } from "../types";
export default {
  "chain": "FIL",
  "chainId": 31415926,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://filecoin.io",
  "name": "Filecoin - Local testnet",
  "nativeCurrency": {
    "name": "testnet filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "networkId": 31415926,
  "rpc": [],
  "shortName": "filecoin-local",
  "slip44": 1,
  "slug": "filecoin-local-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;