import type { Chain } from "../src/types";
export default {
  "name": "Peperium Chain Testnet",
  "chain": "PERIUM",
  "rpc": [
    "https://peperium-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.peperium.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Peperium Chain Testnet",
    "symbol": "PERIUM",
    "decimals": 18
  },
  "infoURL": "https://peperium.io",
  "shortName": "PERIUM",
  "chainId": 4001,
  "networkId": 4001,
  "icon": {
    "url": "ipfs://Qmag2hr5DQghRzKPN3oUFBkjWzqd5CndQzZeb5LfoiMCXf",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Peperium Chain Explorer",
      "url": "https://scan-testnet.peperium.io",
      "icon": {
        "url": "ipfs://Qmag2hr5DQghRzKPN3oUFBkjWzqd5CndQzZeb5LfoiMCXf",
        "width": 160,
        "height": 160,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "peperium-chain-testnet"
} as const satisfies Chain;