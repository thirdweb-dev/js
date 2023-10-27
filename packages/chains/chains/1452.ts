import type { Chain } from "../src/types";
export default {
  "chain": "GIL",
  "chainId": 1452,
  "explorers": [
    {
      "name": "GIL Explorer",
      "url": "https://explorer.giltestnet.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeDXUAYgQxwaSJLsqWgTqnrJVwicgEyNf9199xAMyRkqA",
    "width": 243,
    "height": 243,
    "format": "svg"
  },
  "infoURL": "https://gaussgang.com/",
  "name": "GIL Testnet",
  "nativeCurrency": {
    "name": "GANG",
    "symbol": "GANG",
    "decimals": 18
  },
  "networkId": 1452,
  "rpc": [
    "https://gil-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1452.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.giltestnet.com"
  ],
  "shortName": "gil",
  "slug": "gil-testnet",
  "testnet": true
} as const satisfies Chain;