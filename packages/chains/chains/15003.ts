import type { Chain } from "../src/types";
export default {
  "chain": "Immutable zkEVM",
  "chainId": 15003,
  "explorers": [
    {
      "name": "Immutable Devnet explorer",
      "url": "https://explorer.dev.immutable.com",
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
  "name": "Immutable zkEVM Devnet",
  "nativeCurrency": {
    "name": "Dev IMX",
    "symbol": "dIMX",
    "decimals": 18
  },
  "networkId": 15003,
  "rpc": [
    "https://immutable-zkevm-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://15003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.immutable.com"
  ],
  "shortName": "imx-devnet",
  "slug": "immutable-zkevm-devnet",
  "testnet": false
} as const satisfies Chain;