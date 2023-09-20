import type { Chain } from "../src/types";
export default {
  "name": "Canxium Mainnet",
  "chain": "CAU",
  "icon": {
    "url": "ipfs://QmXHSbtVNCJVfe2CvRH7njdyf2SrX5u5bNTfvhqjLeFN2A",
    "width": 938,
    "height": 938,
    "format": "png"
  },
  "rpc": [
    "https://canxium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.canxium.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Canxium",
    "symbol": "CAU",
    "decimals": 18
  },
  "infoURL": "https://canxium.org",
  "shortName": "cau",
  "chainId": 3003,
  "networkId": 3003,
  "explorers": [
    {
      "name": "canxium explorer",
      "url": "https://explorer.canxium.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "canxium"
} as const satisfies Chain;