import type { Chain } from "../src/types";
export default {
  "chain": "CAU",
  "chainId": 30103,
  "explorers": [
    {
      "name": "canxium explorer",
      "url": "https://cerium-explorer.canxium.net",
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
  "name": "Cerium Testnet",
  "nativeCurrency": {
    "name": "Canxium",
    "symbol": "CAU",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://cerium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cerium-rpc.canxium.net"
  ],
  "shortName": "ceri",
  "slug": "cerium-testnet",
  "testnet": true
} as const satisfies Chain;