import type { Chain } from "../src/types";
export default {
  "chainId": 1777,
  "chain": "Gauss",
  "name": "Gauss Mainnet",
  "rpc": [
    "https://gauss.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gaussgang.com"
  ],
  "slug": "gauss",
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
  "shortName": "gauss",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Gauss Explorer",
      "url": "https://explorer.gaussgang.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;