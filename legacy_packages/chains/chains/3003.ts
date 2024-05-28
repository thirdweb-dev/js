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
  "infoURL": "https://canxium.org",
  "name": "Canxium Mainnet",
  "nativeCurrency": {
    "name": "Canxium",
    "symbol": "CAU",
    "decimals": 18
  },
  "networkId": 3003,
  "rpc": [
    "https://3003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.canxium.org"
  ],
  "shortName": "cau",
  "slug": "canxium",
  "testnet": false
} as const satisfies Chain;