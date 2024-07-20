import type { Chain } from "../src/types";
export default {
  "chain": "OAS",
  "chainId": 9372,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.testnet.oasys.games",
      "standard": "EIP3091"
    },
    {
      "name": "Oasys-Testnet explorer",
      "url": "https://explorer.testnet.oasys.games/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmVjT18MJ7S965w5oTce5D3KPbzfoGGaKaNDKJcfGfSNWm",
        "width": 733,
        "height": 733,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmVjT18MJ7S965w5oTce5D3KPbzfoGGaKaNDKJcfGfSNWm",
    "width": 733,
    "height": 733,
    "format": "png"
  },
  "infoURL": "https://oasys.games",
  "name": "Oasys Testnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 9372,
  "redFlags": [],
  "rpc": [
    "https://9372.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.oasys.games"
  ],
  "shortName": "OAS",
  "slug": "oasys-testnet",
  "testnet": true
} as const satisfies Chain;