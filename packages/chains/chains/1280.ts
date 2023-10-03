import type { Chain } from "../src/types";
export default {
  "chain": "HALO",
  "chainId": 1280,
  "explorers": [
    {
      "name": "HALOexplorer",
      "url": "https://browser.halo.land",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://halo.land/#/",
  "name": "HALO Mainnet",
  "nativeCurrency": {
    "name": "HALO",
    "symbol": "HO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://halo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodes.halo.land"
  ],
  "shortName": "HO",
  "slug": "halo",
  "testnet": false
} as const satisfies Chain;