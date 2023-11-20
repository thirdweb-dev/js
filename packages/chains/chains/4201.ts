import type { Chain } from "../src/types";
export default {
  "chain": "LUKSO Testnet",
  "chainId": 4201,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.testnet.lukso.network",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.testnet.lukso.network"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://Qmeg9sFF5tAGi6MCx7YjtVHW6a23zqvHRK1xwzSdp9iE7z",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://lukso.network",
  "name": "LUKSO Testnet",
  "nativeCurrency": {
    "name": "TestLYX",
    "symbol": "LYXt",
    "decimals": 18
  },
  "networkId": 4201,
  "rpc": [
    "https://lukso-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4201.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.lukso.network",
    "wss://ws-rpc.testnet.lukso.network"
  ],
  "shortName": "lukso-testnet",
  "slug": "lukso-testnet",
  "testnet": true
} as const satisfies Chain;