import type { Chain } from "../types";
export default {
  "chain": "HIK",
  "chainId": 5729,
  "explorers": [
    {
      "name": "Hika Network Testnet Explorer",
      "url": "https://scan-testnet.hika.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW44FPm3CMM2JDs8BQxLNvUtykkUtrGkQkQsUDJSi3Gmp",
    "width": 350,
    "height": 84,
    "format": "png"
  },
  "infoURL": "https://hika.network/",
  "name": "Hika Network Testnet",
  "nativeCurrency": {
    "name": "Hik Token",
    "symbol": "HIK",
    "decimals": 18
  },
  "networkId": 5729,
  "rpc": [
    "https://hika-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5729.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.hika.network/"
  ],
  "shortName": "hik",
  "slug": "hika-network-testnet",
  "testnet": true,
  "title": "Hika Network Testnet"
} as const satisfies Chain;