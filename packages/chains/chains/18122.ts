import type { Chain } from "../src/types";
export default {
  "chainId": 18122,
  "chain": "Smart Trade Networks",
  "name": "Smart Trade Networks",
  "rpc": [
    "https://smart-trade-networks.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beefledgerwallet.com:8544"
  ],
  "slug": "smart-trade-networks",
  "icon": {
    "url": "ipfs://QmRgZVpjik4cH3Sb6wLRpdnfv9kiMEZ8fugfkzTgk3bpRW",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "STN",
    "symbol": "STN",
    "decimals": 18
  },
  "infoURL": "https://www.smarttradenetworks.com",
  "shortName": "STN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "stnscan",
      "url": "https://stnscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;