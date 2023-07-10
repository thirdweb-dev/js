import type { Chain } from "../src/types";
export default {
  "name": "GIL Testnet",
  "chain": "GIL",
  "icon": {
    "url": "ipfs://QmeDXUAYgQxwaSJLsqWgTqnrJVwicgEyNf9199xAMyRkqA",
    "width": 243,
    "height": 243,
    "format": "svg"
  },
  "rpc": [
    "https://gil-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.giltestnet.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GANG",
    "symbol": "GANG",
    "decimals": 18
  },
  "infoURL": "https://gaussgang.com/",
  "shortName": "gil",
  "chainId": 1452,
  "networkId": 1452,
  "explorers": [
    {
      "name": "GIL Explorer",
      "url": "https://explorer.giltestnet.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "gil-testnet"
} as const satisfies Chain;