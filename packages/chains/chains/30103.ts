import type { Chain } from "../src/types";
export default {
  "chainId": 30103,
  "chain": "CAU",
  "name": "Cerium Testnet",
  "rpc": [
    "https://cerium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cerium-rpc.canxium.net"
  ],
  "slug": "cerium-testnet",
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
  "shortName": "ceri",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "canxium explorer",
      "url": "https://cerium-explorer.canxium.net",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;