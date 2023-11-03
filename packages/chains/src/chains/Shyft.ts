import type { Chain } from "../types";
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
  "networkId": 7341,
  "rpc": [
    "https://shyft.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7341.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shyft.network/"
  ],
  "shortName": "shyft",
  "slip44": 2147490989,
  "slug": "shyft",
  "testnet": false
} as const satisfies Chain;