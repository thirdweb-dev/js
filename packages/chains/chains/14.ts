import type { Chain } from "../src/types";
export default {
  "chain": "FLR",
  "chainId": 14,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://flare-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmevAevHxRkK2zVct2Eu6Y7s38YC4SmiAiw9X7473pVtmL",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "infoURL": "https://flare.xyz",
  "name": "Flare Mainnet",
  "nativeCurrency": {
    "name": "Flare",
    "symbol": "FLR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://flare.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://flare-api.flare.network/ext/C/rpc",
    "https://rpc.ftso.au/flare"
  ],
  "shortName": "flr",
  "slug": "flare",
  "testnet": false
} as const satisfies Chain;