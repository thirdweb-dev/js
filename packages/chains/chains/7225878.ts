import type { Chain } from "../src/types";
export default {
  "chainId": 7225878,
  "chain": "Saakuru",
  "name": "Saakuru Mainnet",
  "rpc": [
    "https://saakuru.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.saakuru.network"
  ],
  "slug": "saakuru",
  "icon": {
    "url": "ipfs://QmduEdtFobPpZWSc45MU6RKxZfTEzLux2z8ikHFhT8usqv",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://saakuru.network",
  "shortName": "saakuru",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "saakuru-explorer",
      "url": "https://explorer.saakuru.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;