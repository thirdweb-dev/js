import type { Chain } from "../src/types";
export default {
  "chain": "FIL",
  "chainId": 3141592,
  "explorers": [],
  "faucets": [
    "https://faucet.butterfly.fildev.network"
  ],
  "features": [],
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
  "redFlags": [],
  "rpc": [],
  "shortName": "filecoin-butterfly",
  "slug": "filecoin-butterfly-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;