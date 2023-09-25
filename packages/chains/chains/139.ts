import type { Chain } from "../src/types";
export default {
  "chainId": 139,
  "chain": "WOOP",
  "name": "WoopChain Mainnet",
  "rpc": [
    "https://woopchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.woop.ai/rpc"
  ],
  "slug": "woopchain",
  "icon": {
    "url": "ipfs://Qma7LpnkGjAN1dwL6VTXUYqzySNxjLg4br7J8UE4yZWYec",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "WoopCoin",
    "symbol": "WOOC",
    "decimals": 18
  },
  "infoURL": "https://wikiwoop.com",
  "shortName": "woop",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "wikiwoop",
      "url": "https://explorer.wikiwoop.com",
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