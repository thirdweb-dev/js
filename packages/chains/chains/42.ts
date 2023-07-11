import type { Chain } from "../src/types";
export default {
  "name": "LUKSO Mainnet",
  "chain": "LUKSO",
  "icon": {
    "url": "ipfs://Qmeg9sFF5tAGi6MCx7YjtVHW6a23zqvHRK1xwzSdp9iE7z",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://lukso.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.lukso.network",
    "wss://ws-rpc.mainnet.lukso.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LUKSO",
    "symbol": "LYX",
    "decimals": 18
  },
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.mainnet.lukso.network",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://lukso.network",
  "shortName": "lukso",
  "chainId": 42,
  "networkId": 42,
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ],
  "testnet": false,
  "slug": "lukso"
} as const satisfies Chain;