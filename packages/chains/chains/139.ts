import type { Chain } from "../src/types";
export default {
  "chain": "WOOP",
  "chainId": 139,
  "explorers": [
    {
      "name": "wikiwoop",
      "url": "https://explorer.wikiwoop.com",
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
    "url": "ipfs://Qma7LpnkGjAN1dwL6VTXUYqzySNxjLg4br7J8UE4yZWYec",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "infoURL": "https://wikiwoop.com",
  "name": "WoopChain Mainnet",
  "nativeCurrency": {
    "name": "WoopCoin",
    "symbol": "WOOC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://woopchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.woop.ai/rpc"
  ],
  "shortName": "woop",
  "slug": "woopchain",
  "testnet": false
} as const satisfies Chain;