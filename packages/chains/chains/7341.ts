import type { Chain } from "../src/types";
export default {
  "chainId": 7341,
  "chain": "SHYFT",
  "name": "Shyft Mainnet",
  "rpc": [
    "https://shyft.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shyft.network/"
  ],
  "slug": "shyft",
  "icon": {
    "url": "ipfs://QmUkFZC2ZmoYPTKf7AHdjwRPZoV2h1MCuHaGM4iu8SNFpi",
    "width": 400,
    "height": 400,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Shyft",
    "symbol": "SHYFT",
    "decimals": 18
  },
  "infoURL": "https://shyft.network",
  "shortName": "shyft",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Shyft BX",
      "url": "https://bx.shyft.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;