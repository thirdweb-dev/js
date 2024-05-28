import type { Chain } from "../src/types";
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
  "infoURL": "https://saakuru.network",
  "name": "Saakuru Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 7225878,
  "rpc": [
    "https://7225878.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.saakuru.network"
  ],
  "shortName": "saakuru",
  "slug": "saakuru",
  "testnet": false
} as const satisfies Chain;