import type { Chain } from "../src/types";
export default {
  "chain": "OMNIA",
  "chainId": 2342,
  "explorers": [
    {
      "name": "OmniaVerse Explorer",
      "url": "https://scan.omniaverse.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.omniaverse.io"
  ],
  "icon": {
    "url": "ipfs://QmdNQMFxcjB9PAP1LZVqaQmyppV5QGTqXXmbBeQyaTUpMM",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "infoURL": "https://www.omniaverse.io",
  "name": "Omnia Chain",
  "nativeCurrency": {
    "name": "Omnia",
    "symbol": "OMNIA",
    "decimals": 18
  },
  "networkId": 2342,
  "rpc": [
    "https://2342.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.omniaverse.io"
  ],
  "shortName": "omnia",
  "slug": "omnia-chain",
  "testnet": false
} as const satisfies Chain;