import type { Chain } from "../src/types";
export default {
  "chain": "WBT",
  "chainId": 1875,
  "explorers": [
    {
      "name": "wb-explorer",
      "url": "https://explorer.whitebit.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmbi6cqsQyDjkQSoxbNTTUy8WGyVEFqCtATX2aF4KLmCcZ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://whitebit.network",
  "name": "WhiteBIT Network",
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "networkId": 1875,
  "rpc": [
    "https://whitebit-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1875.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.whitebit.network"
  ],
  "shortName": "wbt",
  "slug": "whitebit-network",
  "testnet": false
} as const satisfies Chain;