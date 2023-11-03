import type { Chain } from "../types";
export default {
  "chain": "crystal",
  "chainId": 103090,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.crystaleum.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmbry1Uc6HnXmqFNXW5dFJ7To8EezCCjNr4TqqvAyzXS4h",
        "width": 150,
        "height": 150,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmbry1Uc6HnXmqFNXW5dFJ7To8EezCCjNr4TqqvAyzXS4h",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "infoURL": "https://crystaleum.org",
  "name": "Crystaleum",
  "nativeCurrency": {
    "name": "CRFI",
    "symbol": "◈",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://crystaleum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://103090.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.cryptocurrencydevs.org",
    "https://rpc.crystaleum.org"
  ],
  "shortName": "CRFI",
  "slug": "crystaleum",
  "testnet": false
} as const satisfies Chain;