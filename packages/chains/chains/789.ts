import type { Chain } from "../src/types";
export default {
  "name": "Patex",
  "chain": "ETH",
  "icon": {
    "url": "ipfs://QmTNTSNn3t5WpSEzQmUYbkxYkBKaH6QahyVdVrRKyPHChr",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "rpc": [
    "https://patex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.patex.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://patex.io/",
  "shortName": "peth",
  "chainId": 789,
  "networkId": 789,
  "explorers": [
    {
      "name": "patexscan",
      "url": "https://patexscan.io",
      "icon": {
        "url": "ipfs://QmTNTSNn3t5WpSEzQmUYbkxYkBKaH6QahyVdVrRKyPHChr",
        "width": 800,
        "height": 800,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "patex"
} as const satisfies Chain;