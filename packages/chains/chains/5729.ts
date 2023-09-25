import type { Chain } from "../src/types";
export default {
  "chainId": 5729,
  "chain": "HIK",
  "name": "Hika Network Testnet",
  "rpc": [
    "https://hika-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.hika.network/"
  ],
  "slug": "hika-network-testnet",
  "icon": {
    "url": "ipfs://QmW44FPm3CMM2JDs8BQxLNvUtykkUtrGkQkQsUDJSi3Gmp",
    "width": 350,
    "height": 84,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Hik Token",
    "symbol": "HIK",
    "decimals": 18
  },
  "infoURL": "https://hika.network/",
  "shortName": "hik",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Hika Network Testnet Explorer",
      "url": "https://scan-testnet.hika.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;