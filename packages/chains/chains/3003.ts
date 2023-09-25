import type { Chain } from "../src/types";
export default {
  "chainId": 3003,
  "chain": "CAU",
  "name": "Canxium Mainnet",
  "rpc": [
    "https://canxium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.canxium.org"
  ],
  "slug": "canxium",
  "icon": {
    "url": "ipfs://QmXHSbtVNCJVfe2CvRH7njdyf2SrX5u5bNTfvhqjLeFN2A",
    "width": 938,
    "height": 938,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Canxium",
    "symbol": "CAU",
    "decimals": 18
  },
  "infoURL": "https://canxium.org",
  "shortName": "cau",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "canxium explorer",
      "url": "https://explorer.canxium.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;