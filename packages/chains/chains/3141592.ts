import type { Chain } from "../src/types";
export default {
  "chainId": 3141592,
  "chain": "FIL",
  "name": "Filecoin - Butterfly testnet",
  "rpc": [],
  "slug": "filecoin-butterfly-testnet",
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [
    "https://faucet.butterfly.fildev.network"
  ],
  "nativeCurrency": {
    "name": "testnet filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "infoURL": "https://filecoin.io",
  "shortName": "filecoin-butterfly",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;