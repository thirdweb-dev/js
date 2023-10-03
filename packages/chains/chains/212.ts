import type { Chain } from "../src/types";
export default {
  "chain": "MAP",
  "chainId": 212,
  "explorers": [
    {
      "name": "mapscan",
      "url": "https://testnet.mapscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.maplabs.io"
  ],
  "features": [],
  "infoURL": "https://maplabs.io",
  "name": "MAP Makalu",
  "nativeCurrency": {
    "name": "Makalu MAP",
    "symbol": "MAP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://map-makalu.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.maplabs.io"
  ],
  "shortName": "makalu",
  "slug": "map-makalu",
  "testnet": true
} as const satisfies Chain;