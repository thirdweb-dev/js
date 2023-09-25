import type { Chain } from "../src/types";
export default {
  "chainId": 1875,
  "chain": "WBT",
  "name": "WhiteBIT Network",
  "rpc": [
    "https://whitebit-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.whitebit.network"
  ],
  "slug": "whitebit-network",
  "icon": {
    "url": "ipfs://Qmbi6cqsQyDjkQSoxbNTTUy8WGyVEFqCtATX2aF4KLmCcZ",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "infoURL": "https://whitebit.network",
  "shortName": "wbt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "wb-explorer",
      "url": "https://explorer.whitebit.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;