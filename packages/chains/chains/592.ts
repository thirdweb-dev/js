import type { Chain } from "../src/types";
export default {
  "name": "Astar",
  "chain": "ASTR",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Astar",
    "symbol": "ASTR",
    "decimals": 18
  },
  "infoURL": "https://astar.network/",
  "shortName": "astr",
  "chainId": 592,
  "networkId": 592,
  "icon": {
    "url": "ipfs://Qmdvmx3p6gXBCLUMU1qivscaTNkT6h3URdhUTZCHLwKudg",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "explorers": [
    {
      "name": "subscan",
      "url": "https://astar.subscan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://Qma2GfW5nQHuA7nGqdEfwaXPL63G9oTwRTQKaGTfjNtM2W",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "testnet": false,
  "slug": "astar"
} as const satisfies Chain;