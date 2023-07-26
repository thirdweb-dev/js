import type { Chain } from "../src/types";
export default {
  "name": "Smart Trade Networks",
  "chain": "Smart Trade Networks",
  "rpc": [
    "https://smart-trade-networks.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beefledgerwallet.com:8544"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "STN",
    "symbol": "STN",
    "decimals": 18
  },
  "infoURL": "https://www.smarttradenetworks.com",
  "shortName": "STN",
  "chainId": 18122,
  "networkId": 18122,
  "icon": {
    "url": "ipfs://QmRgZVpjik4cH3Sb6wLRpdnfv9kiMEZ8fugfkzTgk3bpRW",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "explorers": [
    {
      "name": "stnscan",
      "url": "https://stnscan.com",
      "icon": {
        "url": "ipfs://QmRgZVpjik4cH3Sb6wLRpdnfv9kiMEZ8fugfkzTgk3bpRW",
        "width": 500,
        "height": 500,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "smart-trade-networks"
} as const satisfies Chain;