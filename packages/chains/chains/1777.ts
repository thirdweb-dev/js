import type { Chain } from "../src/types";
export default {
  "chain": "Gauss",
  "chainId": 1777,
  "explorers": [
    {
      "name": "Gauss Explorer",
      "url": "https://explorer.gaussgang.com",
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
  "name": "Gauss Mainnet",
  "nativeCurrency": {
    "name": "GANG",
    "symbol": "GANG",
    "decimals": 18
  },
  "networkId": 1777,
  "rpc": [
    "https://gauss.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gaussgang.com"
  ],
  "shortName": "gauss",
  "slug": "gauss",
  "testnet": false
} as const satisfies Chain;