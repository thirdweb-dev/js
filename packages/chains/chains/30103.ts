import type { Chain } from "../src/types";
export default {
  "name": "Cerium Testnet",
  "chain": "CAU",
  "icon": {
    "url": "ipfs://QmXHSbtVNCJVfe2CvRH7njdyf2SrX5u5bNTfvhqjLeFN2A",
    "width": 938,
    "height": 938,
    "format": "png"
  },
  "rpc": [
    "https://cerium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cerium-rpc.canxium.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Canxium",
    "symbol": "CAU",
    "decimals": 18
  },
  "infoURL": "https://canxium.org",
  "shortName": "ceri",
  "chainId": 30103,
  "networkId": 30103,
  "explorers": [
    {
      "name": "canxium explorer",
      "url": "https://cerium-explorer.canxium.net",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "cerium-testnet"
} as const satisfies Chain;