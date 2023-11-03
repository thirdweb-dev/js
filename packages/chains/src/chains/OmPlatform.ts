import type { Chain } from "../types";
export default {
  "chain": "omplatform",
  "chainId": 1246,
  "explorers": [
    {
      "name": "OMSCAN - Expenter",
      "url": "https://omscan.omplatform.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://omplatform.com/",
  "name": "OM Platform Mainnet",
  "nativeCurrency": {
    "name": "OMCOIN",
    "symbol": "OM",
    "decimals": 18
  },
  "networkId": 1246,
  "rpc": [
    "https://om-platform.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1246.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-cnx.omplatform.com/"
  ],
  "shortName": "om",
  "slug": "om-platform",
  "testnet": false
} as const satisfies Chain;