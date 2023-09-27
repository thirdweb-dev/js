import type { Chain } from "../src/types";
export default {
  "name": "Flare Mainnet",
  "chain": "FLR",
  "icon": {
    "url": "ipfs://QmevAevHxRkK2zVct2Eu6Y7s38YC4SmiAiw9X7473pVtmL",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "rpc": [
    "https://flare.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://flare-api.flare.network/ext/C/rpc",
    "https://rpc.ftso.au/flare"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Flare",
    "symbol": "FLR",
    "decimals": 18
  },
  "infoURL": "https://flare.xyz",
  "shortName": "flr",
  "chainId": 14,
  "networkId": 14,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://flare-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "flare"
} as const satisfies Chain;