import type { Chain } from "../src/types";
export default {
  "chain": "PERIUM",
  "chainId": 4001,
  "explorers": [
    {
      "name": "Peperium Chain Explorer",
      "url": "https://scan-testnet.peperium.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
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
  "redFlags": [],
  "rpc": [
    "https://peperium-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.peperium.io"
  ],
  "shortName": "PERIUM",
  "slug": "peperium-chain-testnet",
  "testnet": true
} as const satisfies Chain;