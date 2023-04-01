import type { Chain } from "../src/types";
export default {
  "name": "Filecoin - Wallaby testnet",
  "chain": "FIL",
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [],
  "faucets": [
    "https://wallaby.yoga/#faucet"
  ],
  "nativeCurrency": {
    "name": "testnet filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "infoURL": "https://filecoin.io",
  "shortName": "filecoin-wallaby",
  "chainId": 31415,
  "networkId": 31415,
  "slip44": 1,
  "explorers": [],
  "testnet": true,
  "slug": "filecoin-wallaby-testnet"
} as const satisfies Chain;