import type { Chain } from "../src/types";
export default {
  "chain": "PERIUM",
  "chainId": 4001,
  "explorers": [
    {
      "name": "Peperium Chain Explorer",
      "url": "https://scan-testnet.peperium.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmag2hr5DQghRzKPN3oUFBkjWzqd5CndQzZeb5LfoiMCXf",
        "width": 160,
        "height": 160,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmag2hr5DQghRzKPN3oUFBkjWzqd5CndQzZeb5LfoiMCXf",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "infoURL": "https://peperium.io",
  "name": "Peperium Chain Testnet",
  "nativeCurrency": {
    "name": "Peperium Chain Testnet",
    "symbol": "PERIUM",
    "decimals": 18
  },
  "networkId": 4001,
  "rpc": [
    "https://4001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.peperium.io"
  ],
  "shortName": "PERIUM",
  "slip44": 1,
  "slug": "peperium-chain-testnet",
  "testnet": true
} as const satisfies Chain;