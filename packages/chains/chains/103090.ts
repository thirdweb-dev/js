import type { Chain } from "../src/types";
export default {
  "chainId": 103090,
  "chain": "crystal",
  "name": "Crystaleum",
  "rpc": [
    "https://crystaleum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.cryptocurrencydevs.org",
    "https://rpc.crystaleum.org"
  ],
  "slug": "crystaleum",
  "icon": {
    "url": "ipfs://Qmbry1Uc6HnXmqFNXW5dFJ7To8EezCCjNr4TqqvAyzXS4h",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "CRFI",
    "symbol": "◈",
    "decimals": 18
  },
  "infoURL": "https://crystaleum.org",
  "shortName": "CRFI",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.crystaleum.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;