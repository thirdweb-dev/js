import type { Chain } from "../src/types";
export default {
  "chainId": 42,
  "chain": "LUKSO",
  "name": "LUKSO Mainnet",
  "rpc": [
    "https://lukso.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.lukso.network",
    "wss://ws-rpc.mainnet.lukso.network"
  ],
  "slug": "lukso",
  "icon": {
    "url": "ipfs://Qmeg9sFF5tAGi6MCx7YjtVHW6a23zqvHRK1xwzSdp9iE7z",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "LUKSO",
    "symbol": "LYX",
    "decimals": 18
  },
  "infoURL": "https://lukso.network",
  "shortName": "lukso",
  "testnet": false,
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.mainnet.lukso.network",
      "standard": "EIP3091"
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