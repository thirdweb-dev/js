import type { Chain } from "../src/types";
export default {
  "chain": "CAU",
  "chainId": 3003,
  "explorers": [
    {
      "name": "canxium explorer",
      "url": "https://explorer.canxium.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmXHSbtVNCJVfe2CvRH7njdyf2SrX5u5bNTfvhqjLeFN2A",
    "width": 938,
    "height": 938,
    "format": "png"
  },
  "infoURL": "https://canxium.org",
  "name": "Canxium Mainnet",
  "nativeCurrency": {
    "name": "Canxium",
    "symbol": "CAU",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://canxium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.canxium.org"
  ],
  "shortName": "cau",
  "slug": "canxium",
  "testnet": false
} as const satisfies Chain;