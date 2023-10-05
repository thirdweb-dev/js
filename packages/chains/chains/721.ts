import type { Chain } from "../src/types";
export default {
  "chain": "LYC",
  "chainId": 721,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.lycanchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmc8hsCbUUjnJDnXrDhFh4V1xk1gJwZbUyNJ39p72javji",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://lycanchain.com",
  "name": "Lycan Chain",
  "nativeCurrency": {
    "name": "Lycan",
    "symbol": "LYC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://lycan-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lycanchain.com/"
  ],
  "shortName": "LYC",
  "slug": "lycan-chain",
  "testnet": false
} as const satisfies Chain;