import type { Chain } from "../src/types";
export default {
  "name": "WoopChain Mainnet",
  "chain": "WOOP",
  "icon": {
    "url": "ipfs://Qma7LpnkGjAN1dwL6VTXUYqzySNxjLg4br7J8UE4yZWYec",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "rpc": [
    "https://woopchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.woop.ai/rpc"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "WoopCoin",
    "symbol": "WOOC",
    "decimals": 18
  },
  "infoURL": "https://wikiwoop.com",
  "shortName": "woop",
  "chainId": 139,
  "networkId": 139,
  "explorers": [
    {
      "name": "wikiwoop",
      "url": "https://explorer.wikiwoop.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "woopchain"
} as const satisfies Chain;