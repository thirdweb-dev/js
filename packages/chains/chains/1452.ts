import type { Chain } from "../src/types";
export default {
  "chainId": 1452,
  "chain": "GIL",
  "name": "GIL Testnet",
  "rpc": [
    "https://gil-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.giltestnet.com"
  ],
  "slug": "gil-testnet",
  "icon": {
    "url": "ipfs://QmeDXUAYgQxwaSJLsqWgTqnrJVwicgEyNf9199xAMyRkqA",
    "width": 243,
    "height": 243,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "GANG",
    "symbol": "GANG",
    "decimals": 18
  },
  "infoURL": "https://gaussgang.com/",
  "shortName": "gil",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "GIL Explorer",
      "url": "https://explorer.giltestnet.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;