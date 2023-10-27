import type { Chain } from "../src/types";
export default {
  "chain": "FLR",
  "chainId": 14,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://flare-explorer.flare.network",
      "standard": "EIP3091"
    },
    {
      "name": "flarescan",
      "url": "https://flarescan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmevAevHxRkK2zVct2Eu6Y7s38YC4SmiAiw9X7473pVtmL",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "infoURL": "https://flare.network",
  "name": "Flare Mainnet",
  "nativeCurrency": {
    "name": "Flare",
    "symbol": "FLR",
    "decimals": 18
  },
  "networkId": 14,
  "rpc": [
    "https://flare.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://14.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://flare-api.flare.network/ext/C/rpc",
    "https://flare.public-rpc.com",
    "https://rpc.ftso.au/flare"
  ],
  "shortName": "flr",
  "slug": "flare",
  "testnet": false
} as const satisfies Chain;