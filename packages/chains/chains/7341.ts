import type { Chain } from "../src/types";
export default {
  "chain": "SHYFT",
  "chainId": 7341,
  "explorers": [
    {
      "name": "Shyft BX",
      "url": "https://bx.shyft.network",
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
  "name": "Shyft Mainnet",
  "nativeCurrency": {
    "name": "Shyft",
    "symbol": "SHYFT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://shyft.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shyft.network/"
  ],
  "shortName": "shyft",
  "slug": "shyft",
  "testnet": false
} as const satisfies Chain;