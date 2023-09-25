import type { Chain } from "../src/types";
export default {
  "chainId": 212,
  "chain": "MAP",
  "name": "MAP Makalu",
  "rpc": [
    "https://map-makalu.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.maplabs.io"
  ],
  "slug": "map-makalu",
  "faucets": [
    "https://faucet.maplabs.io"
  ],
  "nativeCurrency": {
    "name": "Makalu MAP",
    "symbol": "MAP",
    "decimals": 18
  },
  "infoURL": "https://maplabs.io",
  "shortName": "makalu",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "mapscan",
      "url": "https://testnet.mapscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;