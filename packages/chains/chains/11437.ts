import type { Chain } from "../src/types";
export default {
  "chain": "SHYFTT",
  "chainId": 11437,
  "explorers": [
    {
      "name": "Shyft Testnet BX",
      "url": "https://bx.testnet.shyft.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmUkFZC2ZmoYPTKf7AHdjwRPZoV2h1MCuHaGM4iu8SNFpi",
    "width": 400,
    "height": 400,
    "format": "svg"
  },
  "infoURL": "https://shyft.network",
  "name": "Shyft Testnet",
  "nativeCurrency": {
    "name": "Shyft Test Token",
    "symbol": "SHYFTT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "shyftt",
  "slug": "shyft-testnet",
  "testnet": true
} as const satisfies Chain;