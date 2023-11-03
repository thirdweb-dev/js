import type { Chain } from "../types";
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
  "networkId": 721,
  "rpc": [
    "https://lycan-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://721.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lycanchain.com/"
  ],
  "shortName": "LYC",
  "slug": "lycan-chain",
  "testnet": false
} as const satisfies Chain;