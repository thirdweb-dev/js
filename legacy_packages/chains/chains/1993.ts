import type { Chain } from "../src/types";
export default {
  "chain": "B3 Sepolia",
  "chainId": 1993,
  "explorers": [
    {
      "name": "B3 Sepolia Explorer",
      "url": "https://sepolia.explorer.b3.fun/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://cdn.b3.fun/b3_logo%40.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://docs.b3.fun/",
  "name": "B3 Sepolia",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1993,
  "parent": {
    "type": "L3",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.b3.fun/"
      }
    ]
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "b3-sepolia",
  "slug": "b3-sepolia",
  "testnet": true,
  "title": "B3 Sepolia"
} as const satisfies Chain;