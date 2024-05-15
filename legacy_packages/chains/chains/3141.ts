import type { Chain } from "../src/types";
export default {
  "chain": "FIL",
  "chainId": 3141,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://filecoin.io",
  "name": "Filecoin - Hyperspace testnet",
  "nativeCurrency": {
    "name": "testnet filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "networkId": 3141,
  "rpc": [],
  "shortName": "filecoin-hyperspace",
  "slip44": 1,
  "slug": "filecoin-hyperspace-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;