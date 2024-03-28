import type { Chain } from "../src/types";
export default {
  "chain": "FIL",
  "chainId": 31415,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://filecoin.io",
  "name": "Filecoin - Wallaby testnet",
  "nativeCurrency": {
    "name": "testnet filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "networkId": 31415,
  "rpc": [],
  "shortName": "filecoin-wallaby",
  "slip44": 1,
  "slug": "filecoin-wallaby-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;