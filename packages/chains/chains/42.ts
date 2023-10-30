import type { Chain } from "../src/types";
export default {
  "chain": "LUKSO",
  "chainId": 42,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.mainnet.lukso.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
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
  "name": "LUKSO Mainnet",
  "nativeCurrency": {
    "name": "LUKSO",
    "symbol": "LYX",
    "decimals": 18
  },
  "networkId": 42,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://lukso.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://42.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.lukso.network",
    "wss://ws-rpc.mainnet.lukso.network"
  ],
  "shortName": "lukso",
  "slug": "lukso",
  "testnet": false
} as const satisfies Chain;