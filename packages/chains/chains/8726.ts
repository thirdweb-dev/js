import type { Chain } from "../src/types";
export default {
  "chain": "Storagechain",
  "chainId": 8726,
  "explorers": [
    {
      "name": "Storscan",
      "url": "https://explorer-storagechain.invo.zone/?network=StorageChain",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfN9r1S7FvzkbjqfNMdUikhHmCw5e6UqsTuRD51S8T6Cq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://storagechain.io/about-us",
  "name": "Storagechain Mainnet",
  "nativeCurrency": {
    "name": "Storagechain",
    "symbol": "STOR",
    "decimals": 18
  },
  "networkId": 8726,
  "rpc": [
    "https://storagechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8726.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-validator.storagechain.io"
  ],
  "shortName": "stor",
  "slug": "storagechain",
  "testnet": false
} as const satisfies Chain;