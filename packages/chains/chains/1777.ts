import type { Chain } from "../src/types";
export default {
  "name": "Gauss Mainnet",
  "chain": "Gauss",
  "icon": {
    "url": "ipfs://QmeDXUAYgQxwaSJLsqWgTqnrJVwicgEyNf9199xAMyRkqA",
    "width": 243,
    "height": 243,
    "format": "svg"
  },
  "rpc": [
    "https://gauss.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gaussgang.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GANG",
    "symbol": "GANG",
    "decimals": 18
  },
  "infoURL": "https://gaussgang.com/",
  "shortName": "gauss",
  "chainId": 1777,
  "networkId": 1777,
  "explorers": [
    {
      "name": "Gauss Explorer",
      "url": "https://explorer.gaussgang.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "gauss"
} as const satisfies Chain;