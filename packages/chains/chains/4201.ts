import type { Chain } from "../src/types";
export default {
  "name": "LUKSO Testnet",
  "chain": "LUKSO Testnet",
  "icon": {
    "url": "ipfs://Qmeg9sFF5tAGi6MCx7YjtVHW6a23zqvHRK1xwzSdp9iE7z",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://lukso-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.lukso.network",
    "wss://ws-rpc.testnet.lukso.network"
  ],
  "faucets": [
    "https://faucet.testnet.lukso.network"
  ],
  "nativeCurrency": {
    "name": "TestLYX",
    "symbol": "LYXt",
    "decimals": 18
  },
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.testnet.lukso.network",
      "standard": "none"
    }
  ],
  "infoURL": "https://lukso.network",
  "shortName": "lukso-testnet",
  "chainId": 4201,
  "networkId": 4201,
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "testnet": true,
  "slug": "lukso-testnet"
} as const satisfies Chain;