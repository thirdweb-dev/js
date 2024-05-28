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
  "infoURL": "https://wikiwoop.com",
  "name": "WoopChain Mainnet",
  "nativeCurrency": {
    "name": "WoopCoin",
    "symbol": "WOOC",
    "decimals": 18
  },
  "networkId": 139,
  "rpc": [
    "https://139.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.woop.ai/rpc"
  ],
  "shortName": "woop",
  "slug": "woopchain",
  "testnet": false
} as const satisfies Chain;