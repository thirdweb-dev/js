import type { Chain } from "../types";
export default {
  "chain": "Saakuru",
  "chainId": 7225878,
  "explorers": [
    {
      "name": "saakuru-explorer",
      "url": "https://explorer.saakuru.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmduEdtFobPpZWSc45MU6RKxZfTEzLux2z8ikHFhT8usqv",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://saakuru.network",
  "name": "Saakuru Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 7225878,
  "rpc": [
    "https://saakuru.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7225878.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.saakuru.network"
  ],
  "shortName": "saakuru",
  "slug": "saakuru",
  "testnet": false
} as const satisfies Chain;