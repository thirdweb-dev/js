import type { Chain } from "../types";
export default {
  "chain": "Smart Trade Networks",
  "chainId": 18122,
  "explorers": [
    {
      "name": "stnscan",
      "url": "https://stnscan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmRgZVpjik4cH3Sb6wLRpdnfv9kiMEZ8fugfkzTgk3bpRW",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRgZVpjik4cH3Sb6wLRpdnfv9kiMEZ8fugfkzTgk3bpRW",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://www.smarttradenetworks.com",
  "name": "Smart Trade Networks",
  "nativeCurrency": {
    "name": "STN",
    "symbol": "STN",
    "decimals": 18
  },
  "networkId": 18122,
  "rpc": [
    "https://smart-trade-networks.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://18122.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beefledgerwallet.com:8544"
  ],
  "shortName": "STN",
  "slug": "smart-trade-networks",
  "testnet": false
} as const satisfies Chain;