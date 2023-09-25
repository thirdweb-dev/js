import type { Chain } from "../src/types";
export default {
  "chainId": 11437,
  "chain": "SHYFTT",
  "name": "Shyft Testnet",
  "rpc": [],
  "slug": "shyft-testnet",
  "icon": {
    "url": "ipfs://QmUkFZC2ZmoYPTKf7AHdjwRPZoV2h1MCuHaGM4iu8SNFpi",
    "width": 400,
    "height": 400,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Shyft Test Token",
    "symbol": "SHYFTT",
    "decimals": 18
  },
  "infoURL": "https://shyft.network",
  "shortName": "shyftt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Shyft Testnet BX",
      "url": "https://bx.testnet.shyft.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;