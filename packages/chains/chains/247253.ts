import type { Chain } from "../src/types";
export default {
  "chainId": 247253,
  "chain": "Saakuru",
  "name": "Saakuru Testnet",
  "rpc": [
    "https://saakuru-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.saakuru.network"
  ],
  "slug": "saakuru-testnet",
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
  "shortName": "saakuru-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "saakuru-explorer-testnet",
      "url": "https://explorer-testnet.saakuru.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;