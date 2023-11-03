import type { Chain } from "../types";
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
  "infoURL": "https://halo.land/#/",
  "name": "HALO Mainnet",
  "nativeCurrency": {
    "name": "HALO",
    "symbol": "HO",
    "decimals": 18
  },
  "networkId": 1280,
  "rpc": [
    "https://halo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1280.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodes.halo.land"
  ],
  "shortName": "HO",
  "slug": "halo",
  "testnet": false
} as const satisfies Chain;