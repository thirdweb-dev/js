import type { Chain } from "../src/types";
export default {
  "chainId": 789,
  "chain": "ETH",
  "name": "Patex",
  "rpc": [
    "https://patex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.patex.io/"
  ],
  "slug": "patex",
  "icon": {
    "url": "ipfs://QmTNTSNn3t5WpSEzQmUYbkxYkBKaH6QahyVdVrRKyPHChr",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://patex.io/",
  "shortName": "peth",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "patexscan",
      "url": "https://patexscan.io",
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