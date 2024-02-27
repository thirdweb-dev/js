import type { Chain } from "../src/types";
export default {
  "chain": "UBQ",
  "chainId": 8,
  "explorers": [
    {
      "name": "ubiqscan",
      "url": "https://ubiqscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ubiqsmart.com",
  "name": "Ubiq",
  "nativeCurrency": {
    "name": "Ubiq Ether",
    "symbol": "UBQ",
    "decimals": 18
  },
  "networkId": 8,
  "rpc": [
    "https://8.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.octano.dev",
    "https://pyrus2.ubiqscan.io"
  ],
  "shortName": "ubq",
  "slip44": 108,
  "slug": "ubiq",
  "testnet": false
} as const satisfies Chain;