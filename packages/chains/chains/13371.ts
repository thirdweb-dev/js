import type { Chain } from "../src/types";
export default {
  "chain": "Immutable zkEVM",
  "chainId": 13371,
  "explorers": [
    {
      "name": "Immutable explorer",
      "url": "https://explorer.immutable.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXFUYFW4e6wifbU9LKVq7owM14bnE6ZbbYq3bn1jBP3Mw",
        "width": 1168,
        "height": 1168,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://docs.immutable.com/docs/zkEVM/guides/faucet"
  ],
  "icon": {
    "url": "ipfs://QmXFUYFW4e6wifbU9LKVq7owM14bnE6ZbbYq3bn1jBP3Mw",
    "width": 1168,
    "height": 1168,
    "format": "png"
  },
  "infoURL": "https://www.immutable.com",
  "name": "Immutable zkEVM",
  "nativeCurrency": {
    "name": "IMX",
    "symbol": "IMX",
    "decimals": 18
  },
  "networkId": 13371,
  "rpc": [
    "https://13371.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.immutable.com"
  ],
  "shortName": "imx",
  "slug": "immutable-zkevm",
  "testnet": false
} as const satisfies Chain;