import type { Chain } from "../types";
export default {
  "chain": "FIL",
  "chainId": 3141592,
  "explorers": [],
  "faucets": [
    "https://faucet.butterfly.fildev.network"
  ],
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://filecoin.io",
  "name": "Filecoin - Butterfly testnet",
  "nativeCurrency": {
    "name": "testnet filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "networkId": 3141592,
  "rpc": [],
  "shortName": "filecoin-butterfly",
  "slip44": 1,
  "slug": "filecoin-butterfly-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;