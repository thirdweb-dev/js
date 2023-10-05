import type { Chain } from "../src/types";
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
  "features": [],
  "infoURL": "https://omplatform.com/",
  "name": "OM Platform Mainnet",
  "nativeCurrency": {
    "name": "OMCOIN",
    "symbol": "OM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://om-platform.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-cnx.omplatform.com/"
  ],
  "shortName": "om",
  "slug": "om-platform",
  "testnet": false
} as const satisfies Chain;