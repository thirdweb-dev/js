import type { Chain } from "../src/types";
export default {
  "chainId": 721,
  "chain": "LYC",
  "name": "Lycan Chain",
  "rpc": [
    "https://lycan-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lycanchain.com/"
  ],
  "slug": "lycan-chain",
  "icon": {
    "url": "ipfs://Qmc8hsCbUUjnJDnXrDhFh4V1xk1gJwZbUyNJ39p72javji",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Lycan",
    "symbol": "LYC",
    "decimals": 18
  },
  "infoURL": "https://lycanchain.com",
  "shortName": "LYC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.lycanchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;