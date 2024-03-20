import type { Chain } from "../src/types";
export default {
  "chain": "Reya",
  "chainId": 1729,
  "explorers": [
    {
      "name": "Reya Network Explorer",
      "url": "https://explorer.reya.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://reya.network",
  "name": "Reya Network",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1729,
  "rpc": [
    "https://1729.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.reya.network",
    "wss://ws.reya.network"
  ],
  "shortName": "reya",
  "slug": "reya-network",
  "testnet": false
} as const satisfies Chain;