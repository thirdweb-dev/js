import type { Chain } from "../src/types";
export default {
  "chainId": 8,
  "chain": "UBQ",
  "name": "Ubiq",
  "rpc": [
    "https://ubiq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.octano.dev",
    "https://pyrus2.ubiqscan.io"
  ],
  "slug": "ubiq",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ubiq Ether",
    "symbol": "UBQ",
    "decimals": 18
  },
  "infoURL": "https://ubiqsmart.com",
  "shortName": "ubq",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ubiqscan",
      "url": "https://ubiqscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;