import type { Chain } from "../src/types";
export default {
  "chain": "WVM",
  "chainId": 9496,
  "explorers": [
    {
      "name": "WeaveVM Explorer",
      "url": "https://explorer.wvm.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZrL43kuLcK14gQo1cVbzwczcVULxN6NKb4EcjYpFpE7w",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://wvm.dev",
  "name": "WeaveVM Testnet",
  "nativeCurrency": {
    "name": "Testnet WeaveVM Token",
    "symbol": "tWVM",
    "decimals": 18
  },
  "networkId": 9496,
  "rpc": [
    "https://9496.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.wvm.dev"
  ],
  "shortName": "twvm",
  "slug": "weavevm-testnet",
  "testnet": true
} as const satisfies Chain;