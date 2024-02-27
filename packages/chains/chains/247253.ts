import type { Chain } from "../src/types";
export default {
  "chain": "Saakuru",
  "chainId": 247253,
  "explorers": [
    {
      "name": "saakuru-explorer-testnet",
      "url": "https://explorer-testnet.saakuru.network",
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
  "name": "Saakuru Testnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 247253,
  "rpc": [
    "https://247253.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.saakuru.network"
  ],
  "shortName": "saakuru-testnet",
  "slip44": 1,
  "slug": "saakuru-testnet",
  "testnet": true
} as const satisfies Chain;