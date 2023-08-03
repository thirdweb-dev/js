import type { Chain } from "../src/types";
export default {
  "name": "WhiteBIT Network",
  "chain": "WBT",
  "rpc": [
    "https://whitebit-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.whitebit.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "infoURL": "https://whitebit.network",
  "shortName": "wbt",
  "chainId": 1875,
  "networkId": 1875,
  "icon": {
    "url": "ipfs://Qmbi6cqsQyDjkQSoxbNTTUy8WGyVEFqCtATX2aF4KLmCcZ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "wb-explorer",
      "url": "https://explorer.whitebit.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "whitebit-network"
} as const satisfies Chain;