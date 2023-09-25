import type { Chain } from "../src/types";
export default {
  "chainId": 1246,
  "chain": "omplatform",
  "name": "OM Platform Mainnet",
  "rpc": [
    "https://om-platform.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-cnx.omplatform.com/"
  ],
  "slug": "om-platform",
  "faucets": [],
  "nativeCurrency": {
    "name": "OMCOIN",
    "symbol": "OM",
    "decimals": 18
  },
  "infoURL": "https://omplatform.com/",
  "shortName": "om",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "OMSCAN - Expenter",
      "url": "https://omscan.omplatform.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;