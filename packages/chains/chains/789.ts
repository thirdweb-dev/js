import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 789,
  "explorers": [
    {
      "name": "patexscan",
      "url": "https://patexscan.io",
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
    "url": "ipfs://QmTNTSNn3t5WpSEzQmUYbkxYkBKaH6QahyVdVrRKyPHChr",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://patex.io/",
  "name": "Patex",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://patex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.patex.io/"
  ],
  "shortName": "peth",
  "slug": "patex",
  "testnet": false
} as const satisfies Chain;