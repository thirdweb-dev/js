import type { Chain } from "../src/types";
export default {
  "chain": "FIL",
  "chainId": 31415926,
  "explorers": [],
  "faucets": [],
  "features": [],
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
  "redFlags": [],
  "rpc": [],
  "shortName": "filecoin-local",
  "slug": "filecoin-local-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;