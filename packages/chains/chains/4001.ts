import type { Chain } from "../src/types";
export default {
  "chainId": 4001,
  "chain": "PERIUM",
  "name": "Peperium Chain Testnet",
  "rpc": [
    "https://peperium-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.peperium.io"
  ],
  "slug": "peperium-chain-testnet",
  "icon": {
    "url": "ipfs://Qmag2hr5DQghRzKPN3oUFBkjWzqd5CndQzZeb5LfoiMCXf",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Peperium Chain Testnet",
    "symbol": "PERIUM",
    "decimals": 18
  },
  "infoURL": "https://peperium.io",
  "shortName": "PERIUM",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Peperium Chain Explorer",
      "url": "https://scan-testnet.peperium.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;