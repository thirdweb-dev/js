import type { Chain } from "../src/types";
export default {
  "chainId": 1280,
  "chain": "HALO",
  "name": "HALO Mainnet",
  "rpc": [
    "https://halo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodes.halo.land"
  ],
  "slug": "halo",
  "faucets": [],
  "nativeCurrency": {
    "name": "HALO",
    "symbol": "HO",
    "decimals": 18
  },
  "infoURL": "https://halo.land/#/",
  "shortName": "HO",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "HALOexplorer",
      "url": "https://browser.halo.land",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;