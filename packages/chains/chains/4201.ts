import type { Chain } from "../src/types";
export default {
  "chainId": 4201,
  "chain": "LUKSO Testnet",
  "name": "LUKSO Testnet",
  "rpc": [
    "https://lukso-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.lukso.network",
    "wss://ws-rpc.testnet.lukso.network"
  ],
  "slug": "lukso-testnet",
  "icon": {
    "url": "ipfs://Qmeg9sFF5tAGi6MCx7YjtVHW6a23zqvHRK1xwzSdp9iE7z",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.testnet.lukso.network"
  ],
  "nativeCurrency": {
    "name": "TestLYX",
    "symbol": "LYXt",
    "decimals": 18
  },
  "infoURL": "https://lukso.network",
  "shortName": "lukso-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.testnet.lukso.network",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;