import type { Chain } from "../src/types";
export default {
  "chain": "Immutable zkEVM",
  "chainId": 13473,
  "explorers": [
    {
      "name": "Immutable Testnet explorer",
      "url": "https://explorer.testnet.immutable.com",
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
  "name": "Immutable zkEVM Testnet",
  "nativeCurrency": {
    "name": "Test IMX",
    "symbol": "tIMX",
    "decimals": 18
  },
  "networkId": 13473,
  "rpc": [
    "https://immutable-zkevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://13473.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.immutable.com"
  ],
  "shortName": "imx-testnet",
  "slip44": 1,
  "slug": "immutable-zkevm-testnet",
  "testnet": true
} as const satisfies Chain;