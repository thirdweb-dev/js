import type { Chain } from "../src/types";
export default {
  "chainId": 33333,
  "chain": "AVS",
  "name": "Aves Mainnet",
  "rpc": [
    "https://aves.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.avescoin.io"
  ],
  "slug": "aves",
  "icon": {
    "url": "ipfs://QmeKQVv2QneHaaggw2NfpZ7DGMdjVhPywTdse5RzCs4oGn",
    "width": 232,
    "height": 232,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Aves",
    "symbol": "AVS",
    "decimals": 18
  },
  "infoURL": "https://avescoin.io",
  "shortName": "avs",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "avescan",
      "url": "https://avescan.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;