import type { Chain } from "../src/types";
export default {
  "name": "Worldland Mainnet",
  "chain": "Worldland",
  "icon": "worldland",
  "rpc": [
    "https://worldland.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seoul.worldland.foundation"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Worldland",
    "symbol": "WL",
    "decimals": 18
  },
  "infoURL": "https://worldland.foundation",
  "shortName": "WLC",
  "chainId": 103,
  "networkId": 103,
  "explorers": [
    {
      "name": "Worldland Explorer",
      "url": "https://scan.worldland.foundation",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "worldland"
} as const satisfies Chain;