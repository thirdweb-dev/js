import type { Chain } from "../src/types";
export default {
  "chain": "AVS",
  "chainId": 33333,
  "explorers": [
    {
      "name": "avescan",
      "url": "https://avescan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmeKQVv2QneHaaggw2NfpZ7DGMdjVhPywTdse5RzCs4oGn",
    "width": 232,
    "height": 232,
    "format": "png"
  },
  "infoURL": "https://avescoin.io",
  "name": "Aves Mainnet",
  "nativeCurrency": {
    "name": "Aves",
    "symbol": "AVS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://aves.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.avescoin.io"
  ],
  "shortName": "avs",
  "slug": "aves",
  "testnet": false
} as const satisfies Chain;